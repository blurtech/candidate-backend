const userRouter = require('./user/routes');
const initiativeRouter = require('./initiative/routes');

module.exports = (app) => {
    app.use('/user', userRouter);
    app.use('/initiative', initiativeRouter);

    app.get('/', (req, res) => res.send({success: true,data:Boolean(Math.round(Math.random()))}));
};
