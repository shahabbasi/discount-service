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


const discountCodeStateEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
}
discountCodeStateEnum.choices = getEnumChoiceList(calculationTypesEnum);


module.exports = {
  calculationTypesEnum,
  discountCodeStateEnum,
};
