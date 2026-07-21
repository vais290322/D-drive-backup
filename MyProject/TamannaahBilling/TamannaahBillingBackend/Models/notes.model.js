import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  }, 
  date: {
    type: Date,
    required: true 
  },
  amountType:{
    type:String,
    enum:['increase','decrease'],
    required:true
  },
  description: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true 
  },
  type: {
    type: String,
    enum: ['product', 'service','purchase',],
    required: true
  },
  
}, { timestamps: true });

const Notes = mongoose.model('Notes', notesSchema);
export default Notes;