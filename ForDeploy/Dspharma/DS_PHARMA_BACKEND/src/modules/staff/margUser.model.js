import mongoose from 'mongoose';

const margUserSchema = new mongoose.Schema(
  {
    RowId: {
      type: Number,
      required: true,
    },
    UserId: {
      type: String,
      maxlength: 50,
      default: '',
    },
    Name: {
      type: String,
      maxlength: 100,
      required: true,
    },
    Address1: {
      type: String,
      maxlength: 60,
      default: '',
    },
    Address2: {
      type: String,
      maxlength: 60,
      default: '',
    },
    Address3: {
      type: String,
      maxlength: 60,
      default: '',
    },
    Phone: {
      type: String,
      maxlength: 25,
      default: '',
    },
    Mobile: {
      type: String,
      maxlength: 25,
      default: '',
    },
    Email: {
      type: String,
      maxlength: 50,
      default: '',
    },
    Is_Deleted: {
      type: String,
      maxlength: 1,
      enum: ['0', '1'],
      default: '0',
    },
    Type: {
      type: String,
      maxlength: 1,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const MargUser = mongoose.model('MargUser', margUserSchema);

export default MargUser;
