const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/test').catch((err) => {
  console.log('Mongodb connection failed. ERROR::');
  console.log(err);
  process.exit(1);
});
