const userRouter = require('./user/routes');
const initiativeRouter = require('./initiative/routes');
const swipeRouter = require('./swipe/routes');
const orgRouter = require('./organization/routes');

module.exports = (app) => {
    app.use('/user', userRouter);
    app.use('/initiative', initiativeRouter);
    app.use('/swipe', swipeRouter);
    app.use('/organization', orgRouter);

    app.get('/', (req, res) => res.send({success: true,data:Boolean(Math.round(Math.random()))}));
};
