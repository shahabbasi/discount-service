const express = require('express');
const router = express.Router();
const { model: DiscountPolicy } = require('../../models/DiscountPolicy.model');
const { model: DiscountCode } = require('../../models/DiscountCode.model');


router.post('/generate', async function (req, res, next) {
  try {
    const codes = await DiscountPolicy.generate(req.body);
    return res.json(codes);
  } catch (e) {
    return next(e);
  }
});

router.get('/list', async function(req, res, next) {
  try {
    const result = await DiscountCode.find({});
    return res.json(result);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
