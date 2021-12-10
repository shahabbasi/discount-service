const express = require('express');
const router = express.Router();
const { model: DiscountCode } = require('../../models/DiscountCode.model');


router.post('/calculate', async function (req, res, next) {
  try {
    const {
      body: {
        code,
        amount,
      },
      userIdentity
    } = req;
    const result = await DiscountCode.previewDiscountCode(code, userIdentity, amount);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
})

router.post('/activate', async function(req, res, next) {
  try {
    const {
      body: {
        code,
        amount,
      },
      userIdentity
    } = req;
    const result = await DiscountCode.activateDiscountCode(code, userIdentity, amount);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
