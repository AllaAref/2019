const express = require('express');
const api = express();
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cors = require('cors');
const morgan = require('morgan');
const apiRouter = require('./api/api');
const PORT = process.env.PORT || 4000;
const cookiesMiddleware = require('universal-cookie-express');

api.use(express.static('public'));
api.use(errorHandler());
api.use(bodyParser.json());
const whitelist = ['http://localhost:3000', 'http://localhost:4000'];
const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

api.use(cookiesMiddleware());

api.use(cors(corsOptions));

if (!process.env.IS_TEST_ENV) {
  api.use(morgan('dev'));
};

api.use('/api', apiRouter);

api.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT);
})

module.exports = api;