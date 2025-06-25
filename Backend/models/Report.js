const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  severity: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
},{
  versionKey: false // 👈 disables __v
},
 {
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
