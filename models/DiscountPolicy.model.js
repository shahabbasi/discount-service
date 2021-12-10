const mongoose = require('mongoose');
const { getEnumChoiceList } = require('../utils/enum-helper');

/*
  This enum part could be cleaner,
  probably OOP patterns would help,
  but right now faster approach is more important
*/
const calculationTypesEnum = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
};
calculationTypesEnum.choices = getEnumChoiceList(calculationTypesEnum);


const discountPolicySchema = new mongoose.Schema({
  expiryDate: {
    type: Date,
    required: false,
    default: null,
  },
  ownerUser: {
    type: String, // let's imagine we've got an authentication service + a middleware which will pass a unique identifier for the logged in user.
    required: false,
    default: null,
  },
  perUserUsageLimit: {
    type: Number,
    default: 1,
  },
  totalUsageLimit: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  calculationPolicy: {
    calculationType: {
      type: String,
      enum: calculationTypesEnum.choices,
      default: calculationTypesEnum.PERCENTAGE
    },
    activationMargin: {
      type: Number,
      required: true
    },
    calculationHighMargin: {
      type: Number,
      required: false
    }
  }
}, { timestamps: true });

const DiscountPolicy = new mongoose.model('discountPolicy', discountPolicySchema);


module.exports = {
  enums: {
    calculationTypesEnum
  },
  schema: discountPolicySchema,
  model: DiscountPolicy
};
