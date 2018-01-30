const config = require('./config/index');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compress = require('compression');
const expressValidation = require('express-validation');
const httpStatus = require('http-status');
const cors = require('cors');
const path = require('path');
const APIError = require('./helpers/APIError');
const indexRoutes = require('./routes/index');

const app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compress());
app.use(cors());

if (config.env === 'development') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

/* connecting to mongodb */
// mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Mongodb is connected!!');
  })
  .catch(err => {
    console.warn(err);
  });
// static resource directory
app.use(express.static(path.join(__dirname, 'public')));
// api routes registration
app.use('/api', indexRoutes);

app.use('/', function (req, res) {
  res.json({ message: 'api server', user: req.auth_user });
});
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    console.log(unifiedErrorMessage);
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});
