const rootRouter = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const signin = require('./signin');
const signup = require('./signup');
const notFound = require('./notFound');

const auth = require('../middlewares/auth');

rootRouter.use('/signin', signin);
rootRouter.use('/signup', signup);
rootRouter.use('/users', auth, userRouter);
rootRouter.use('/cards', auth, cardRouter);
rootRouter.use('*', notFound);

module.exports = rootRouter;
