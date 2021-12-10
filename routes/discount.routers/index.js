const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const userRouter = require('./user');
const merchantRouter = require('./merchant');


router.use('/user', auth('user'), userRouter);
router.use('/merchant', auth('merchant'), merchantRouter);


module.exports = router;
