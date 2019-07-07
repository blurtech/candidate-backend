/*const config = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGO_URI,
    secret: process.env.SECRET
};*/

const config = {
    port: process.env.PORT || 3000,
    mongoUrl: 'mongodb://root:toor123456@ds347707.mlab.com:47707/candidate', //process.env.MONGO_URI,
    secret: 'meow' //process.env.SECRET
};


module.exports = config;
