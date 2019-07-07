const Initiative = require('./model');
const User = require('../user/model');
const UserRepository = require('../user/repository');


exports.saveInitiative = (data, saveCb) => {
    const user = new Initiative(data);
    return user.save(saveCb);
};

exports.editInitiative = (Initiative, data, saveCb) => {
    Initiative.set(data);
    return Initiative.save(saveCb);
};

exports.getAllOrgInitiatives = () => Initiative.find({isOrg: true});

exports.deleteInitiative = (Initiative) => Initiative.remove();

exports.findInitiativeByID = (id) => Initiative.findById(id);

exports.findInitiativesByID = (idArr) => Initiative.where('_id').in(idArr);

exports.findAllInitiatives = () => Initiative.find();

exports.findAllInitiativesByUsername = (username) => Initiative.find({creator: username});

exports.findInitiativesForUser = async (username) => {
    let notIn = username.history.map(val => val.initiative._id);
    let finded = await Initiative.find({_id: { $nin: notIn}});
    return finded;
};

exports.addUserToInitiative = async (Initiative, user, saveCb) => {
    const _Initiative = await Initiative.findById(Initiative.id);
    await _Initiative.set('voters', Initiative.voters.filter(userId => !userId.equals(user.id)).concat(user._id));
    return _Initiative.save(saveCb);
};

exports.removeUserFromInitiative = async (Initiative, user, saveCb) => {
    const _Initiative = await Initiative.findById(Initiative.id);
    await _Initiative.set('voters', Initiative.voters.filter(userId => !userId.equals(user.id)));
    await _Initiative.save();
    await Initiative.find({ voters: { $exists: true, $size: 0}}).remove().exec();
};

exports.updateRatingByVote = async (initiative, vote, saveCb) => {
    return await Initiative.findOneAndUpdate({_id: initiative}, {$inc: {rating: (vote === 'Dislike') ? -1 : 1}});
};

exports.updateHistory = async (initiative, vote, saveCb) => {
    //const _Initiative = await Initiative.find({_id: initiative});
    await Initiative.findOneAndUpdate({_id: initiative}, {$push: {history: {dateOfVoting: Date.now(), vote: vote}}});
    //await _Initiative.history.push({dateOfVoting: Date.now(), vote: vote});
    //return await _Initiative.save(saveCb);
};
