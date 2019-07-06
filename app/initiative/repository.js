const Initiative = require('./model');

const saveInitiative = (data, saveCb) => {
    const user = new Initiative(data);
    return user.save(saveCb);
};

const editInitiative = (Initiative, data, saveCb) => {
    Initiative.set(data);
    return Initiative.save(saveCb);
};

const deleteInitiative = (Initiative) => Initiative.remove();

const findInitiativeByID = (id) => Initiative.findById(id);

const findInitiativesByID = (idArr) => Initiative.where('_id').in(idArr);

const findAllInitiatives = () => Initiative.find();

const addUserToInitiative = async (Initiative, user, saveCb) => {
    const _Initiative = await Initiative.findById(Initiative.id);
    await _Initiative.set('voters', Initiative.voters.filter(userId => !userId.equals(user.id)).concat(user._id));
    return _Initiative.save(saveCb);
};

const removeUserFromInitiative = async (Initiative, user, saveCb) => {
    const _Initiative = await Initiative.findById(Initiative.id);
    await _Initiative.set('voters', Initiative.voters.filter(userId => !userId.equals(user.id)));
    await _Initiative.save();
    await Initiative.find({ voters: { $exists: true, $size: 0}}).remove().exec();
};

module.exports = {
    saveInitiative,
    editInitiative,
    deleteInitiative,
    findInitiativeByID,
    findInitiativesByID,
    findAllInitiatives,
    addUserToInitiative,
    removeUserFromInitiative
};
