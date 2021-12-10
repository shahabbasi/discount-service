const express = require('express');
const router = express.Router();
const discountRouter = require('./discount.routers');


router.use('/discount', discountRouter);


module.exports = router;
