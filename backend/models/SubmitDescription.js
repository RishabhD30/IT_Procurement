const mongoose = require('mongoose');

const VenderSubmitSchema = new mongoose.Schema({
    requireID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinalList', // Assuming 'Requirement' is the correct model name
      required: true
    },
    email: {
      type: String,
      required: true
    },
    qty: {
      type: Number, // This should be a number, not an ObjectId
      required: true
    }
  });
  
  const VenderSubmit = mongoose.model('VenderSubmit', VenderSubmitSchema);
  
module.exports = VenderSubmit; 