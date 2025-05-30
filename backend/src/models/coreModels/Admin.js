const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true },
  surname: { type: String },
  photo: {
    type: String,
    trim: true,
  },
    country: String,

  created: {
    type: Date,
    default: Date.now,
  },
  // role: {
  //   type: String,
  //   default: 'owner',
  //   enum: ['owner'],
  // },
 role: {
    type: String,
    enum: ['owner', 'admin', 'branch_manager', 'employee'],
    default: 'admin',
      required: true
  },
});

module.exports = mongoose.model('Admin', adminSchema);
