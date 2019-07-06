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

    if(!username || username.length < 6) {
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

    repository.saveUser({
        username,
        password
    }, (err) => {
        if (err) {
            return res.validationError(err);
        }
        return res.success({message: 'Successful created new user'});
    });
};

exports.profile = (req, res) => {
    const username = req.params.username;
    repository.findUserByUsername(username)
    .then(user_info => {
        if (!user_info) {
            return res.notFound();
        }
        return initiativeRepository.findInitiativesByID(user_info.subscribed)
        .then(initiatives =>  res.success({user_info, initiatives}));
    })
    .catch(err => {
        return res.serverError(err);
    });
};

exports.currentUser = async (req, res) => {
    const user_info = await repository.selectUserPublicInfo(req.user);
    const initiatives = await initiativeRepository.findInitiativesByID(user_info.subscribed);
    return res.success({user_info, initiatives});
};

exports.editProfile = (req, res) => {
    return repository.editUser(req.user, req.body, (err) => {
        if (err) {
            return res.validationError(err);
        }
        return res.success({message: 'Successful edit profile'});
    });
};
