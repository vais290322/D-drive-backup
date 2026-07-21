import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import Item from '../Models/item.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BulkController {
  /**
   * Process CSV file upload for items
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async uploadItemsCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Please upload a CSV file' 
        });
      }

      const results = [];
      const failedRows = [];
      const successItems = [];

      // Process CSV file
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          // Remove temporary file
          fs.unlinkSync(req.file.path);

          if (results.length === 0) {
            return res.status(400).json({ 
              success: false,
              message: 'The uploaded file is empty' 
            });
          }

          // Process each row
          for (const row of results) {
            try {
              // Validate required fields
              const requiredFields = ['item_name', 'item_id', 'group',  'hsnCode',];
              
              for (const field of requiredFields) {
                if (!row[field]) {
                  throw new Error(`Missing required field: ${field}`);
                }
              }

              // Check if item_id already exists
              const existingItem = await Item.findOne({ item_id: row.item_id });
              if (existingItem) {
                throw new Error(`Item with ID ${row.item_id} already exists`);
              }

              // Convert numeric fields
              const numericFields = ['unit_prize', 'sellingPrice', 'total_prize', 'quantity', 'gst','openningStock'];
              numericFields.forEach(field => {
                if (row[field]) {
                  row[field] = parseFloat(row[field]);
                }
              });

              // Create new item
              const newItem = new Item({
                item_name: row.item_name,
                item_id: row.item_id,
                group: row.group,
                openningStock: row.openningStock || row.quantity || 0,
                unit_prize: row.unit_prize || 0,
                sellingPrice: row.sellingPrice || row.unit_prize || 0,
                total_prize: row.total_prize || row.unit_prize * row.quantity || 0,
                quantity: row.quantity || row.openningStock || 0,
                hsnCode: row.hsnCode,
                gst:row.gst || 0,
                uom:row.uom,
                created_date: new Date(),
                updated_date: new Date()
              });

              // Save to database
              await newItem.save();
              successItems.push(newItem);
            } catch (error) {
              failedRows.push({ 
                row, 
                error: error.message 
              });
            }
          }

          return res.status(200).json({
            success: true,
            message: 'File processed successfully',
            totalRecords: results.length,
            successCount: successItems.length,
            failedCount: failedRows.length,
            successItems: successItems,
            failedRows: failedRows
          });
        });
    } catch (error) {
      console.error('Error in uploadItemsCSV:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  }

  /**
   * Download template for item bulk upload
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadItemTemplate(req, res) {
    try {
      const templateContent = 
        'item_name,item_id,group,unit_prize,sellingPrice,total_prize,quantity,openningStock,hsnCode,gst,uom\n' +
        'Sample Item,ITEM001,Sample Group,100,120,100,1,10,12345,9,pics\n';
      
      const tempFilePath = path.join(__dirname, '../temp', 'item_template.csv');
      
      // Ensure temp directory exists
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Write template file
      fs.writeFileSync(tempFilePath, templateContent);
      
      res.download(tempFilePath, 'item_template.csv', (err) => {
        // Delete the temporary file after download
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        
        if (err && !res.headersSent) {
          return res.status(500).json({ 
            success: false,
            message: 'Error downloading template', 
            error: err.message 
          });
        }
      });
    } catch (error) {
      console.error('Error in downloadItemTemplate:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  }
}

export default new BulkController();
