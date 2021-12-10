const mongoose = require('mongoose');
const { model: ArchivedDiscountCode } = require('./ArchivedDiscountCode.model');
const { discountCodeStateEnum } = require('./enums');
const ApiError = require('../utils/ApiError');
const schemaObject = require('./DiscountCode.schema');


const discountCodeSchema = new mongoose.Schema(schemaObject, {
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
  const archived = new ArchivedDiscountCode(this.toJSON());
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
  await this.populate('policy');
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

discountCodeSchema.static('previewDiscountCode', async function(code, userIdentity, amount) {
  const discountCode = await this.findOne({code: code});
  if (!discountCode) {
    const archivedCode = await ArchivedDiscountCode.findOne({code: code});
    if (!archivedCode) {
      throw new ApiError(404, 'Entered discount code is invalid');
    } else {
      throw new ApiError(409, 'Entered discount code is expired');
    }
  }
  return await discountCode.previewDiscountAmount(userIdentity, amount);
});

discountCodeSchema.static('activateDiscountCode', async function(code, userIdentity, amount) {
  const discountCode = await this.findOne({code: code});
  if (!discountCode) {
    const archivedCode = await ArchivedDiscountCode.findOne({code: code});
    if (!archivedCode) {
      throw new ApiError(404, 'Entered discount code is invalid');
    } else {
      throw new ApiError(409, 'Entered discount code is expired');
    }
  }
  return await discountCode.activateForUser(userIdentity, amount);
});

const DiscountCode = new mongoose.model('discountCode', discountCodeSchema);

module.exports = {
  schema: schemaObject,
  model: DiscountCode,
};
