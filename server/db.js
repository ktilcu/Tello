const nconf = require('nconf');
const mongoose = require('mongoose');

mongoose.connect(
  nconf.get('MONGO_URL'),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, x) => (err ? console.error(err) : console.log('Mongo connected!'))
);
