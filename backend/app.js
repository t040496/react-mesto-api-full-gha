const express = require('express');
const mongoose = require('mongoose');
const validationErrors = require('celebrate').errors;

const rootRouter = require('./routes');

const errors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());

app.use(requestLogger);
app.use(rootRouter);
app.use(errorLogger);

app.use(validationErrors());
app.use(errors);

app.listen(3000, () => {});
