const jwt = require('jsonwebtoken');
const passport = require('passport');
const { secret } = require('../../config/config');

const repository = require('./repository');
const initiativeRepository = require('../initiative/repository');

exports.tryWithJWT = (req, res) => {
    const payload = {
        id: req.user.id,
        username: req.user.username
    };
    res.success(payload);
};

exports.login = (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.loginError(user, 
                info ? info.message : 'Login failed');
        }

        req.login(user, {session: false}, (err) => { 
            if (err) {
                return res.send(err);
            }
            const payload = {
                id: user.id,
                username: user.username
            };
            const token = jwt.sign(payload, secret);
            repository.findUserByID(user.id)
            .then(user => user.set({token: token}).save())
            .then(() => res.success({user: payload, token}))
            .catch(err => res.serverError());
        });
    })(req, res);
};

exports.register = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const geo = req.body.geo;

    if(!username) {
        return res.validationError({
            errors: [{
                path: 'username',
                message: 'Please pass username'
            }]
        });
    }

    if(!password) {
        return res.validationError({
            errors: [{
                path: 'password',
                message: 'Please pass password'
            }]
        });
    }

    if(!geo || !geo.city || !geo.district) {
        return res.validationError({
            errors: [{
                path: 'password',
                message: 'Please pass geo'
            }]
        });
    }

    repository.saveUser({
        username,
        password,
        geo
    }, (err) => {
        if (err) {
            return res.validationError(err);
        }
        return res.success({message: 'Successful created new user'});
    });
};

exports.profile = async (req, res) => {
    const username = req.params.username;
    const user = await repository.findUserByUsername(username);
    return res.success(user);
};

exports.currentUser = async (req, res) => {
    const user_info = await repository.selectUserPublicInfo(req.user);
    return res.success(user_info);
};

exports.editProfile = (req, res) => {
    return repository.editUser(req.user, req.body, (err) => {
        if (err) {
            return res.validationError(err);
        }
        return res.success({message: 'Successful edit profile'});
    });
};
