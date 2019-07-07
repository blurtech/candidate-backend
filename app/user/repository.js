const User = require('./model');
const Initiative = require('../initiative/repository');

exports.saveUser = (data, saveCb) => {
    const user = new User(data);
    return user.save(saveCb);
};

exports.editUser = (user, data, saveCb) => {
    if (data.password) {
        if (!data.check_password) {
            return saveCb({errors: [{
                path: 'password',
                message: 'Require check_password field for change password'
            }]});
        }
        return user.verifyPassword(data.check_password)
        .then(data => {
            if(!data) {
                return saveCb({
                    errors: [{
                        path: 'password',
                        message: 'check_password is not correct'
                }]});
            }
            user.set(data);
            return user.save(saveCb);
        })
        .catch(err => saveCb(err));
    }
    if (data.token) {
        return saveCb({
            errors: [{
                path: 'token',
                message: 'You could not set token'
        }]});
    }
    if (data.voted) {
        return saveCb({
            errors: [{
                path: 'token',
                message: 'You could not set voted'
        }]});
    }
    user.set(data);
    return user.save(saveCb);
};

exports.deleteUser = (user) => user.remove();

exports.findUserByID = (id) => User.findById(id);

exports.findUserByUsername = (username) => User.findOne({username}).select({token: 0, password: 0, email: 0});

exports.findUsernamesById = (idArr) => User.where('_id').in(idArr).select('username');

exports.addInitiativeToUser = addInitiativeToUser;

exports.removeInitiativeFromUser = addInitiativeToUser;

async function addInitiativeToUser(user, initiativeId, saveCb) {
    const _user = await User.findById(user.id);
    return _user.save(saveCb);
}

exports.positiveSwipesHistory = async (username) => {
    let positiveSwipes = username.history.map(val => {
        if(val.vote === "Like" || val.vote === "Superlike") {
            return val.initiative._id;
        }
    });
    let result = await Initiative.findInitiativesByID(positiveSwipes);
    return result;
};

exports.voteForInitiative = async (user, initiativeId, _vote,saveCb) => {
    await user.history.push({initiative: initiativeId, vote: _vote});
    return user.save(saveCb);
};

exports.selectUserPublicInfo = (user) => User.findById(user.id).select({token: 0, password: 0});
