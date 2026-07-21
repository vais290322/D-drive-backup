import mongoose from "mongoose";

const snigdhaNotesSchema = new mongoose.Schema({
  
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
    enum: ['product', 'purchase'],
    required: true
  },
  
}, { timestamps: true });

const SnigdhaNotes = mongoose.model('SnigdhaNotes', snigdhaNotesSchema);
export default SnigdhaNotes;