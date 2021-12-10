const mongoose = require('mongoose');
const { model: ArchivedCode } = require('./ArchivedDiscountCode.model');
const { discountCodeStateEnum } = require('./enums');


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
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret._id;
      return ret
    },
    virtuals: false,
  }
});


discountCodeSchema.method('archive', async function() {
  const archived = new ArchivedCode(this.toJSON());
  await archived.save();
  await this.remove();
});

discountCodeSchema.method('archiveIfNeeded', async function() {
  const state = await this.policy.getCodeState(this.usageCounter);
  if (state === discountCodeStateEnum.EXPIRED) {
    await this.archive();
  }
});

discountCodeSchema.method('previewDiscountAmount', async function(userIdentity, amount) {
  const policy = this.policy;
  const result = await policy.getDiscountedAmount(
    userIdentity,
    this.usageCounter,
    this.activationCounterMap,
    amount
  );
  return result;
});

discountCodeSchema.method('activateForUser', async function(userIdentity, amount) {
  const policy = this.policy;
  const discountData = await policy.getDiscountedAmount(
    userIdentity,
    this.usageCounter,
    this.activationCounterMap,
    amount
  );
  this.usageCounter += 1;
  const userUsage = this.activationCounterMap.get(userIdentity);
  if (typeof(userUsage) !== 'undefined') {
    this.activationCounterMap.set(userIdentity, userUsage + 1);
  } else {
    this.activationCounterMap.set(userIdentity, 1);
  }
  await this.save();
  await this.archiveIfNeeded();
  return discountData;
});

const DiscountCode = new mongoose.model('discountCode', discountCodeSchema);

module.exports = {
  schema: discountCodeSchema,
  model: DiscountCode,
}
