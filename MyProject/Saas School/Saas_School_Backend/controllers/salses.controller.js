import SalesModel from "../models/Salses.model.js";
import InventoryModel from "../models/Inventory.model.js";

const createInvoice = async (req, res) => {
  try {
    const { schoolId } = req.params;
    if(!schoolId){
        return res.status(400).json({
            success:false,
            message:"School ID is required for sales invoice",
            data:null,
            error:true
        })
    }

    const {
      invoiceNumber,
      date,
      studentName,
      admissionNumber,
      studentPhone,
      studentAddress,
      className,
      section,
      rollNumber,
      items,
      grossAmount,
      discount,
      netAmount,
      roundOff,
      totalAmount,
      createdBy,
      paymentMethod,
      cardDetails,
      chequeDetails,
      onlineDetails
    } = req.body;

    /* -------------------- 1️⃣ Required field validation -------------------- */

    const requiredFields = {
      schoolId,
      invoiceNumber,
      date,
      studentName,
      items,
      grossAmount,
      discount,
      netAmount,
      roundOff,
      totalAmount,
    };

    const missingFields = Object.keys(requiredFields).filter(
      (key) =>
        requiredFields[key] === undefined ||
        requiredFields[key] === null ||
        requiredFields[key] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(", ")}`,
        data: null,
        error: true,
      });
    }

    /* -------------------- 2️⃣ Items validation -------------------- */

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
        data: null,
        error: true,
      });
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const requiredItemFields = [
        "name",
        "code",
        "categoryId",
        "category",
        "unit",
        "quantity",
        "price",
        "sellPrice",
        "totalPrice",
      ];

      for (const field of requiredItemFields) {
        if (
          item[field] === undefined ||
          item[field] === null ||
          item[field] === ""
        ) {
          return res.status(400).json({
            success: false,
            message: `Item ${i + 1}: ${field} is required`,
            data: null,
            error: true,
          });
        }
      }

      if (item.quantity <= 0 || item.sellPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `Item ${i + 1}: invalid quantity or price`,
          data: null,
          error: true,
        });
      }
    }

    /* -------------------- 3️⃣ STOCK AVAILABILITY CHECK -------------------- */

    for (const item of items) {
      const inventoryItem = await InventoryModel.findOne({
        schoolId,
        code: item.code,
      });

      if (!inventoryItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.name} not found in inventory`,
          data: null,
          error: true,
        });
      }

      if (Number(inventoryItem.stock) < Number(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${inventoryItem.stock}`,
          data: null,
          error: true,
        });
      }
    }

    /* -------------------- 4️⃣ REDUCE INVENTORY STOCK -------------------- */

    for (const item of items) {
      const inventoryItem = await InventoryModel.findOne({
        schoolId,
        code: item.code,
      });

      inventoryItem.stock =
        Number(inventoryItem.stock) - Number(item.quantity);

      inventoryItem.totalPrice =
        Number(inventoryItem.totalPrice) -
        Number(inventoryItem.price || item.price) * Number(item.quantity);

      inventoryItem.totalSellStock =
        Number(inventoryItem.totalSellStock) + Number(item.quantity);

      // Safety
      if (inventoryItem.stock < 0) inventoryItem.stock = 0;
      if (inventoryItem.totalPrice < 0) inventoryItem.totalPrice = 0;

     

      await inventoryItem.save();
    }

    // check payment details is present or not 
    if(paymentMethod === "Card"){
      if(!cardDetails){
        return res.status(400).json({
          success: false,
          message: "Card details are required for card payment",
          data: null,
          error: true,
        });
      }
    } else if(paymentMethod === "Cheque"){
      if(!chequeDetails){
        return res.status(400).json({
          success: false,
          message: "Cheque details are required for cheque payment",
          data: null,
          error: true,
        });
      }
    } else if(paymentMethod === "Online"){
      if(!onlineDetails){
        return res.status(400).json({
          success: false,
          message: "Online details are required for online payment",
          data: null,
          error: true,
        });
      }
    }else{
      // Other payment methods don't need additional details
      console.log("Other payment methods don't need additional details");
    }
    /* -------------------- 5️⃣ CREATE SALES INVOICE -------------------- */

    const newInvoice = new SalesModel({
      schoolId,
      invoiceNumber,
      date,
      studentName,
      admissionNumber,
      studentPhone,
      studentAddress,
      className,
      section,
      rollNumber,
      items,
      grossAmount,
      discount,
      netAmount,
      roundOff,
      totalAmount,
      createdBy,
      paymentMethod,
      cardDetails,
      chequeDetails,
      onlineDetails
    });

    await newInvoice.save();

    return res.status(201).json({
      success: true,
      message: "Sales invoice created successfully",
      data: newInvoice,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
      error: true,
    });
  }
};

const getAllInvoice = async(req,res)=>{
    try {
        const {schoolId} = req.params;
        if(!schoolId){
            return res.status(400).json({
                success:false,
                message:"School ID is required",
                data:null,
                error:true
            })
        }
        const invoice = await SalesModel.find({schoolId}).sort({createdAt:-1});
        if(!invoice){
            return res.status(404).json({
                success:false,
                message:"Sales invoice not found for this school",
                data:null,
                error:true
            })
        }
        return res.status(200).json({
            success:true,
            message:"Sales invoice fetched successfully",
            data:invoice,
            error:false
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message||"Internal server error",
            data:null,
            error:true
        })
    }
}

const updateInvoice = async (req, res) => {
  try {
    const { schoolId, id } = req.params;
    if(!schoolId || !id){
        return res.status(400).json({
            success:false,
            message:"School ID and Invoice ID are required",
            data:null,
            error:true
        })
    }

    const {
      invoiceNumber,
      date,
      studentName,
      admissionNumber,
      studentPhone,
      studentAddress,
      className,
      section,
      rollNumber,
      items,
      grossAmount,
      discount,
      netAmount,
      roundOff,
      totalAmount,
      createdBy,
      paymentMethod,
      cardDetails,
      chequeDetails,
      onlineDetails,
    } = req.body;

    /* -------------------- 1️⃣ Required field validation -------------------- */

    const requiredFields = {
      schoolId,
      invoiceNumber,
      date,
      studentName,
      items,
      grossAmount,
      discount,
      netAmount,
      roundOff,
      totalAmount,
    };

    const missingFields = Object.keys(requiredFields).filter(
      (key) =>
        requiredFields[key] === undefined ||
        requiredFields[key] === null ||
        requiredFields[key] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(", ")}`,
        data: null,
        error: true,
      });
    }

    /* -------------------- 2️⃣ Fetch existing invoice -------------------- */

    const invoice = await SalesModel.findOne({ _id: id, schoolId });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Sales invoice not found",
        data: null,
        error: true,
      });
    }

    /* -------------------- 3️⃣ ROLLBACK OLD SALE (RESTORE STOCK) -------------------- */

    for (const oldItem of invoice.items) {
      const inventoryItem = await InventoryModel.findOne({
        schoolId,
        code: oldItem.code,
      });

      if (inventoryItem) {
        inventoryItem.stock =
          Number(inventoryItem.stock) + Number(oldItem.quantity);

        inventoryItem.totalPrice =
          Number(inventoryItem.totalPrice) +
          Number(oldItem.price) * Number(oldItem.quantity);
        
        inventoryItem.totalSellStock = Number(inventoryItem.totalSellStock) - Number(oldItem.quantity);

        await inventoryItem.save();
      }
    }

    /* -------------------- 4️⃣ CHECK NEW STOCK AVAILABILITY -------------------- */

    for (const item of items) {
      const inventoryItem = await InventoryModel.findOne({
        schoolId,
        code: item.code,
      });

      if (!inventoryItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.name} not found in inventory`,
          data: null,
          error: true,
        });
      }

      if (Number(inventoryItem.stock) < Number(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${inventoryItem.stock}`,
          data: null,
          error: true,
        });
      }
    }

    /* -------------------- 5️⃣ APPLY NEW SALE -------------------- */

    for (const item of items) {
      const inventoryItem = await InventoryModel.findOne({
        schoolId,
        code: item.code,
      });

      inventoryItem.stock =
        Number(inventoryItem.stock) - Number(item.quantity);

      inventoryItem.totalPrice =
        Number(inventoryItem.totalPrice) -
        Number(item.price) * Number(item.quantity);
    
      inventoryItem.totalSellStock = Number(inventoryItem.totalSellStock) + Number(item.quantity);

      // Safety
      if (inventoryItem.stock < 0) inventoryItem.stock = 0;
      if (inventoryItem.totalPrice < 0) inventoryItem.totalPrice = 0;

      await inventoryItem.save();
    }

     // check payment details is present or not 
    if(paymentMethod === "Card"){
      if(!cardDetails){
        return res.status(400).json({
          success: false,
          message: "Card details are required for card payment",
          data: null,
          error: true,
        });
      }
    } else if(paymentMethod === "Cheque"){
      if(!chequeDetails){
        return res.status(400).json({
          success: false,
          message: "Cheque details are required for cheque payment",
          data: null,
          error: true,
        });
      }
    } else if(paymentMethod === "Online"){
      if(!onlineDetails){
        return res.status(400).json({
          success: false,
          message: "Online details are required for online payment",
          data: null,
          error: true,
        });
      }
    }else{
      // Other payment methods don't need additional details
      console.log("Other payment methods don't need additional details");
    }

    /* -------------------- 6️⃣ UPDATE INVOICE -------------------- */

    const updatedInvoice = await SalesModel.findByIdAndUpdate(
      id,
      {
        invoiceNumber,
        date,
        studentName,
        admissionNumber,
        studentPhone,
        studentAddress,
        className,
        section,
        rollNumber,
        items,
        grossAmount,
        discount,
        netAmount,
        roundOff,
        totalAmount,
        createdBy: createdBy ? createdBy : invoice.createdBy || {},
        paymentMethod: paymentMethod ? paymentMethod : invoice.paymentMethod || "",
        cardDetails: cardDetails ? cardDetails : invoice.cardDetails || {},
        chequeDetails: chequeDetails ? chequeDetails : invoice.chequeDetails || {},
        onlineDetails: onlineDetails ? onlineDetails : invoice.onlineDetails || {},
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sales invoice updated successfully",
      data: updatedInvoice,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
      error: true,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { schoolId, id } = req.params;
    if(!schoolId || !id){
        return res.status(400).json({
            success:false,
            message:"School ID and Invoice ID are required",
            data:null,
            error:true
        })
    }

    /* -------------------- 1️⃣ Fetch invoice -------------------- */

    const invoice = await SalesModel.findOne({ _id: id, schoolId });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Sales invoice not found",
        data: null,
        error: true,
      });
    }

    /* -------------------- 2️⃣ ROLLBACK SOLD STOCK -------------------- */

    for (const item of invoice.items) {
      const inventoryItem = await InventoryModel.findOne({
        schoolId,
        code: item.code,
      });

      if (inventoryItem) {
        inventoryItem.stock =
          Number(inventoryItem.stock) + Number(item.quantity);

        inventoryItem.totalPrice =
          Number(inventoryItem.totalPrice) +
          Number(item.price) * Number(item.quantity);

        inventoryItem.totalSellStock = Number(inventoryItem.totalSellStock) - Number(item.quantity);

        await inventoryItem.save();
      } 
    }

    /* -------------------- 3️⃣ DELETE INVOICE -------------------- */

    const deletedInvoice = await SalesModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Sales invoice deleted successfully",
      data: deletedInvoice,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
      error: true,
    });
  }
};


export {createInvoice, getAllInvoice, updateInvoice, deleteInvoice};
