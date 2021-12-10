const mongoose = require('mongoose');
const { schema: discountCodeSchema } = require('./DiscountCode.model');


const ArchivedDiscountCode = mongoose.model('archivedCode', discountCodeSchema);

module.exports = {
  schema: discountCodeSchema,
  model: ArchivedDiscountCode,
}
