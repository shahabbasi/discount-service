const mongoose = require('mongoose');


const discountCodeSchema = new mongoose.Schema({
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
  activationCounterList: {
    type: mongoose.Schema.Types.Map,
    default: new Map()
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'discountPolicy',
    required: false,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret._id;
      return ret
    }
  }
});


const DiscountCode = new mongoose.model('discountCode', discountCodeSchema);

module.exports = {
  schema: discountCodeSchema,
  model: DiscountCode,
}
