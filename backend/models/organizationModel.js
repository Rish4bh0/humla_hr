const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an organization name'],
  },
  contact: {
    type: Number
  },
  email: {
    type: String
  },
  description: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Organization', organizationSchema);