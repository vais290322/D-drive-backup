import {
  fetchMasterData,
  fetchMasterOrderData,
  fetchMasterOrderDispatchData,
} from '../../marg/fetchMasterData.js';
import ProductInfo from '../products/productInfo.model.js';
import MargUser from '../staff/margUser.model.js';
import Stype from '../stype/stype.model.js';
import MargParties from './marg_parties.model.js';
import MargProducts from './marg_products.model.js';

const BATCH_SIZE = 1000; // records per batch
const CONCURRENCY = 10; // batches running in parallel

// Run bulkWrite ops in parallel batches, return aggregated counts
const parallelBulkWrite = async (model, ops) => {
  const batches = [];
  for (let i = 0; i < ops.length; i += BATCH_SIZE)
    batches.push(ops.slice(i, i + BATCH_SIZE));

  let matched = 0,
    modified = 0,
    upserted = 0;

  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const group = batches.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      group.map(batch => model.bulkWrite(batch, { ordered: false })),
    );
    for (const r of results) {
      matched += r.matchedCount;
      modified += r.modifiedCount;
      upserted += r.upsertedCount ?? 0;
    }
    console.log(
      `  bulkWrite progress: ${Math.min(i + CONCURRENCY, batches.length)}/${batches.length} batches done`,
    );
  }

  return { matched, modified, upserted };
};

// Run insertMany in parallel batches
const parallelInsertMany = async (model, docs, opts = {}) => {
  const batches = [];
  for (let i = 0; i < docs.length; i += BATCH_SIZE)
    batches.push(docs.slice(i, i + BATCH_SIZE));

  let inserted = 0;
  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const group = batches.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      group.map(batch =>
        model.insertMany(batch, { ordered: false, ...opts }).catch(() => []),
      ),
    );
    for (const r of results) inserted += r.length;
    console.log(
      `  insertMany progress: ${Math.min(i + CONCURRENCY, batches.length)}/${batches.length} batches done`,
    );
  }
  return inserted;
};

export const syncMastersDataService = async (dateTime, index = 0) => {
  try {
    // Call Marg service to fetch all master data
    const margData = await fetchMasterData(dateTime, index);

    const {
      pro_N,
      pro_S,
      pro_R,
      pro_U,
      Stype: stype,
      Party: party,
      Users: users,
    } = margData.Details;

    // pro_N + pro_U: Full catalog replacement
    // pro_N = new products, pro_U = updated products.
    // Since pro_N triggers a full deleteMany, pro_U records won't exist after that.
    // Merging both into one insertMany is much faster than 29k individual upserts.
    const hasNewProducts = pro_N && Array.isArray(pro_N) && pro_N.length > 0;
    const hasUpdatedProducts =
      pro_U && Array.isArray(pro_U) && pro_U.length > 0;

    if (hasNewProducts || hasUpdatedProducts) {
      const allProducts = [...(pro_N || []), ...(pro_U || [])];
      console.log(
        `Full product sync: ${allProducts.length} products (pro_N: ${(pro_N || []).length}, pro_U: ${(pro_U || []).length})`,
      );

      try {
        // Step 1: Delete all existing products (clean slate)
        const deleteResult = await MargProducts.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products`);

        // Step 2: Insert all products in parallel batches (insertMany >> upsert for fresh inserts)
        const inserted = await parallelInsertMany(MargProducts, allProducts);
        console.log(
          `Product sync completed: ${inserted}/${allProducts.length} inserted`,
        );

        // Step 3: Create ProductInfo entries (ignore duplicates via ordered:false)
        const defaultImageUrl =
          process.env.DEFAULT_PRODUCT_IMAGE_URL ||
          'https://jetsonpharma.com/wp-content/uploads/2023/05/medicine-placeholder-300x300.png';

        const productInfoDocs = allProducts.map(p => ({
          rid: p.rid,
          images: [{ url: defaultImageUrl }],
        }));
        await parallelInsertMany(ProductInfo, productInfoDocs);
        console.log(`ProductInfo sync done`);
      } catch (dbError) {
        console.error('Product sync error:', dbError);
        throw new Error(`Failed to sync products: ${dbError.message}`);
      }
    } else {
      console.log(
        'No new or updated products from Marg (pro_N and pro_U are empty)',
      );
    }

    // pro_S: Stock updated — update only stock field, matched by code
    if (pro_S && Array.isArray(pro_S) && pro_S.length > 0) {
      console.log(`Updating stock for ${pro_S.length} products (pro_S)...`);
      try {
        const bulkOps = pro_S.map(p => ({
          updateOne: {
            filter: { code: p.code },
            update: { $set: { stock: p.stock } },
          },
        }));
        const result = await parallelBulkWrite(MargProducts, bulkOps);
        console.log(`pro_S stock sync completed:`, result);
      } catch (dbError) {
        console.error('pro_S sync error:', dbError);
        throw new Error(`Failed to sync pro_S: ${dbError.message}`);
      }
    } else {
      console.log('No stock updates to sync (pro_S is empty or invalid)');
    }

    // pro_R: Rate + stock updated — update pricing & stock fields, matched by code
    if (pro_R && Array.isArray(pro_R) && pro_R.length > 0) {
      console.log(`Updating rates for ${pro_R.length} products (pro_R)...`);
      try {
        const bulkOps = pro_R.map(p => ({
          updateOne: {
            filter: { code: p.code },
            update: {
              $set: {
                stock: p.stock,
                MRP: p.MRP,
                Rate: p.Rate,
                Deal: p.Deal,
                Free: p.Free,
                PRate: p.PRate,
                curbatch: p.Curbatch,
              },
            },
          },
        }));
        const result = await parallelBulkWrite(MargProducts, bulkOps);
        console.log(`pro_R rate sync completed:`, result);
      } catch (dbError) {
        console.error('pro_R sync error:', dbError);
        throw new Error(`Failed to sync pro_R: ${dbError.message}`);
      }
    } else {
      console.log('No rate updates to sync (pro_R is empty or invalid)');
    }

    // Sync party data to MargParties model - FULL REPLACEMENT
    if (party && Array.isArray(party) && party.length > 0) {
      console.log(
        `Replacing database with ${party.length} parties from Marg...`,
      );

      try {
        const DEFAULT_PASSWORD = 'DSPHARMA@2026';

        // Step 1: Delete all existing parties
        const deleteResult = await MargParties.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing parties`);

        // Step 2: Build party docs with auth fields extracted from address
        // The address field contains the phone number as its last space-separated token
        // e.g. "BERACHAMPA BERACHAMPA BERACHAMPA 7074903661" → userId = "7074903661"
        const partyDocs = party.map(p => {
          const addressParts = (p.address || '').trim().split(/\s+/);
          const lastToken = addressParts[addressParts.length - 1] || '';
          const extractedPhone = /^\d+$/.test(lastToken) ? lastToken : null;

          return {
            rid: p.rid,
            area: p.area,
            code: p.code,
            address: p.address,
            name: p.name,
            balance: p.balance,
            pdc: p.pdc,
            gcode: p.gcode,
            opening: p.opening,
            Is_Deleted: p.Is_Deleted,
            phone1: p.phone1,
            phone2: p.phone2,
            phone3: p.phone3,
            phone4: p.phone4,
            email1: p.email1,
            email2: p.email2,
            email3: p.email3,
            bank: p.bank,
            branch: p.branch,
            MargCode: p.MargCode,
            GSTIN: p.GSTIN,
            DlNo: p.DlNo,
            LedgerCode: p.LedgerCode,
            userId: extractedPhone, // phone number from address
            password: DEFAULT_PASSWORD,
            isVerified: true,
          };
        });

        // Step 3: Insert all parties with credentials in one pass
        const insertResult = await MargParties.insertMany(partyDocs, {
          ordered: false,
          lean: true,
        });

        console.log(`Party sync completed (marg_parties):`, {
          deleted: deleteResult.deletedCount,
          inserted: insertResult.length,
          total: party.length,
        });
      } catch (dbError) {
        console.error('Database sync error:', dbError);
        throw new Error(
          `Failed to sync parties to database: ${dbError.message}`,
        );
      }
    } else {
      console.log('No parties to sync (party is empty or invalid)');
    }

    // Sync users data to User model - FULL REPLACEMENT
    if (users && Array.isArray(users) && users.length > 0) {
      console.log(`Replacing database with ${users.length} users from Marg...`);

      try {
        // Step 1: Delete all existing products
        const deleteResult = await MargUser.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products`);

        // Step 2: Insert all new products
        const insertResult = await MargUser.insertMany(users, {
          ordered: false, // Continue on error
          lean: true,
        });

        console.log(`User sync completed:`, {
          deleted: deleteResult.deletedCount,
          inserted: insertResult.length,
          total: users.length,
        });
      } catch (dbError) {
        console.error('Database sync error:', dbError);
        throw new Error(`Failed to sync users to database: ${dbError.message}`);
      }
    } else {
      console.log('No users to sync (users is empty or invalid)');
    }

    // Sync stype data to Stype model - FULL REPLACEMENT
    if (stype && Array.isArray(stype) && stype.length > 0) {
      console.log(
        `Replacing database with ${stype.length} stypes from Marg...`,
      );

      try {
        // Step 1: Delete all existing products
        const deleteResult = await Stype.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing stypes`);

        // Step 2: Insert all new products
        const insertResult = await Stype.insertMany(stype, {
          ordered: false, // Continue on error
          lean: true,
        });

        console.log(`Stype sync completed:`, {
          deleted: deleteResult.deletedCount,
          inserted: insertResult.length,
          total: stype.length,
        });
      } catch (dbError) {
        console.error('Database sync error:', dbError);
        throw new Error(
          `Failed to sync stypes to database: ${dbError.message}`,
        );
      }
    } else {
      console.log('No stypes to sync (stype is empty or invalid)');
    }

    return margData.Details;
  } catch (error) {
    throw new Error(`Master sync failed: ${error.message}`);
  }
};

export const syncMasterOrderDispatchDataService = async (
  salesManId = '',
  dateTime = '',
  index = 0,
  type = 'S',
) => {
  try {
    console.log('Master Sync Service');
    // Call Marg service to fetch all master data
    const margData = await fetchMasterOrderDispatchData(
      dateTime,
      index,
      salesManId,
      type,
    );

    return margData.Details;
  } catch (error) {
    throw new Error(`Master sync failed: ${error.message}`);
  }
};

export const syncMasterOrderDataService = async (
  salesManId = '',
  type = 'S',
  data,
) => {
  try {
    console.log('Master Sync Service');
    // Call Marg service to fetch all master data
    const margData = await fetchMasterOrderData(salesManId, type, data);

    console.log('margData', margData);

    return margData.Details;
  } catch (error) {
    throw new Error(`Master sync failed: ${error.message}`);
  }
};
