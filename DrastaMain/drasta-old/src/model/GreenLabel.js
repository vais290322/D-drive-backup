const mongoose = require('mongoose');

const greenLabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Sex is required']
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required']
  },
  stateOfResidence: {
    type: String,
    required: [true, 'State of Residence is required']
  },
  contactDetails: {
    type: String,
    required: [true, 'Contact Details are required']
  },
  cellNo: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  comments: {
    type: String,
    required: [true, 'Comments are required'],
    maxlength: [300, 'Comments cannot exceed 300 words']
  }
}, { timestamps: true });

module.exports = mongoose.model('GreenLabel', greenLabelSchema);