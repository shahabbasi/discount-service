const mongoose = require('mongoose');
const { getEnumChoiceList } = require('../utils/enum-helper');
const ApiError = require('../utils/ApiError');

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
    },
    amount: {
      type: Number,
      required: true,
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret._id;
      return ret
    }
  }
});


discountPolicySchema.method('calculateDiscountAmount', async function(amount) {
  const calculation = this.calculationPolicy;
  if (amount < calculation.activationMargin) {
    return 0;
  }
  let calculated = (
    calculation.calculationType === calculationTypesEnum.FIXED_AMOUNT ?
      calculation.amount :
      amount * calculation.amount / 100
  )
  if (calculated > calculation.calculationHighMargin) {
    calculated = calculation.calculationHighMargin;
  }
  return calculated;
});

discountPolicySchema.method('getDiscountedAmount', async function(
  userIdentity,
  totalUsage,
  usedByMap,
  amount
) {
  if (!this.isActive) {
    throw new ApiError(409, 'Entered discount code is not available at the moment');
  }
  const now = new Date();
  if (this.expiryDate && this.expiryDate <= now) {
    throw new ApiError(404, 'Entered discount code is expired');
  }
  if (this.ownerUser && this.ownerUser !== userIdentity) {
    throw new ApiError(403, 'You\'re not allowed to use this code');
  }
  if (this.totalUsageLimit > 0 && this.totalUsageLimit >= totalUsage) {
    throw new ApiError(404, 'Entered discount code is expired');
  }
  if (this.perUserUsageLimit > 0 && usedByMap.has(userIdentity)) {
    const userUsage = usedByMap.get(userIdentity)
    if (userUsage >= this.perUserUsageLimit) {
      throw new ApiError(403, `You've already used this code ${userUsage} time[s]`);
    }
  }
  const discountAmount = this.calculateDiscountAmount(amount);
  if (discountAmount === 0) {
    throw ApiError(
      400,
      'Entered discount code does not effect this invoice cost amount',
      { amount: amount, discount: 0 },
    );
  }
  return { amount: amount - discountAmount, discount: discountAmount };
});

const DiscountPolicy = new mongoose.model('discountPolicy', discountPolicySchema);


module.exports = {
  enums: {
    calculationTypesEnum
  },
  schema: discountPolicySchema,
  model: DiscountPolicy
};
