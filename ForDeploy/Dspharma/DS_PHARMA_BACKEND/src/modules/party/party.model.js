import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
  {
    rid: String,
    area: String,
    code: String,
    address: String,
    name: String,
    balance: String,
    pdc: String,
    gcode: String,
    opening: String,
    Is_Deleted: String,
    phone1: String,
    phone2: String,
    phone3: String,
    phone4: String,
    email1: String,
    email2: String,
    email3: String,
    bank: String,
    branch: String,
    MargCode: String,
    GSTIN: String,
    DlNo: String,
    LedgerCode: String,
    userId: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'parties',
  },
);

const Party = mongoose.model('Party', partySchema);

export default Party;
