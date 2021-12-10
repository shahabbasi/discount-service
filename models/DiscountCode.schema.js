const mongoose = require('mongoose');

module.exports = {
  code: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  usageCounter: {
    type: Number,
    required: false,
    default: 0,
  },
  activationCounterMap: {
    type: mongoose.Schema.Types.Map,
    default: new Map()
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'discountPolicy',
    required: false,
    default: null,
  },
}