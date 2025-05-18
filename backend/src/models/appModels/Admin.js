const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  name: {
    type: String,
    required: true,
  },
  phone: String,
  country: String,
  address: String,
  email: String,
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
// models/Admin.js
role: {
  type: String,
  enum: ['owner', 'admin', 'branch_manager', 'employee'],
  default: 'employee',
  required: true
},
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Cient', schema);
