const mongoose = require('mongoose');
const schemaObject = require('./DiscountCode.schema');

const archivedCodeSchema = new mongoose.Schema(schemaObject, {
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret._id;
      return ret
    },
    virtuals: false,
  }
});

const ArchivedDiscountCode = mongoose.model('archivedCode', archivedCodeSchema);

module.exports = {
  model: ArchivedDiscountCode,
}
