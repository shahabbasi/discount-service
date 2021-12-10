const express = require('express');
const router = express.Router();
const { model: DiscountPolicy } = require('../../models/DiscountPolicy.model');


router.post('/generate', async function (req, res, next) {
  try {
    const result = await DiscountPolicy.generate(req.body);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
})

router.get('/list', async function(req, res, next) {
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
