import {
  fetchMasterData,
  fetchMasterOrderData,
  fetchMasterOrderDispatchData,
} from "../../marg/fetchMasterData.js";
import Party from "../party/party.model.js";
import ProN from "../products/proN.model.js";
import Stype from "../stype/stype.model.js";
import MargUser from "../users/margUser.model.js";

export const syncMastersDataService = async (dateTime, index = 0) => {
  try {
    console.log("Master Sync Service");
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

    // Sync pro_N data to ProN model - FULL REPLACEMENT
    if (pro_N && Array.isArray(pro_N) && pro_N.length > 0) {
      console.log(
        `Replacing database with ${pro_N.length} products from Marg...`,
      );

      try {
        // Step 1: Delete all existing products
        const deleteResult = await ProN.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products`);

        // Step 2: Insert all new products
        const insertResult = await ProN.insertMany(pro_N, {
          ordered: false, // Continue on error
          lean: true,
        });

        console.log(`Products sync completed:`, {
          deleted: deleteResult.deletedCount,
          inserted: insertResult.length,
          total: pro_N.length,
        });
      } catch (dbError) {
        console.error("Database sync error:", dbError);
        throw new Error(
          `Failed to sync products to database: ${dbError.message}`,
        );
      }
    } else {
      console.log("No products to sync (pro_N is empty or invalid)");
    }

    // Sync party data to Party model - FULL REPLACEMENT
    if (party && Array.isArray(party) && party.length > 0) {
      console.log(
        `Replacing database with ${party.length} parties from Marg...`,
      );

      try {
        // Step 1: Delete all existing products
        const deleteResult = await Party.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products`);

        // Step 2: Insert all new products
        const insertResult = await Party.insertMany(party, {
          ordered: false, // Continue on error
          lean: true,
        });

        console.log(`Party sync completed:`, {
          deleted: deleteResult.deletedCount,
          inserted: insertResult.length,
          total: party.length,
        });
      } catch (dbError) {
        console.error("Database sync error:", dbError);
        throw new Error(
          `Failed to sync parties to database: ${dbError.message}`,
        );
      }
    } else {
      console.log("No parties to sync (party is empty or invalid)");
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
        console.error("Database sync error:", dbError);
        throw new Error(`Failed to sync users to database: ${dbError.message}`);
      }
    } else {
      console.log("No users to sync (users is empty or invalid)");
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
        console.error("Database sync error:", dbError);
        throw new Error(
          `Failed to sync stypes to database: ${dbError.message}`,
        );
      }
    } else {
      console.log("No stypes to sync (stype is empty or invalid)");
    }

    return margData.Details;
  } catch (error) {
    throw new Error(`Master sync failed: ${error.message}`);
  }
};

export const syncMasterOrderDispatchDataService = async (
  dateTime,
  index = 0,
  salesManId = "",
  type = "S",
) => {
  try {
    console.log("Master Sync Service");
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
  salesManId = "",
  type = "S",
) => {
  try {
    console.log("Master Sync Service");
    // Call Marg service to fetch all master data
    const margData = await fetchMasterOrderData(salesManId, type);

    return margData.Details;
  } catch (error) {
    throw new Error(`Master sync failed: ${error.message}`);
  }
};
