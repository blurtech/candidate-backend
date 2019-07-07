const userRepository = require('../user/repository');
const initiativeRepository = require('../initiative/repository');

exports.swipe = async (req, res) => {
    const data = req.body;
    const user = req.user;

    if (!user) {
        return res.validationError({
            errors: [{
                path: 'creator',
                message: 'User must swipe initiative'
            }]
        });
    }

    const initiative = await initiativeRepository.findInitiativeByID(data.id);
    const creator =  await userRepository.findUserByUsername(initiative.creator);

    await userRepository.voteForInitiative(user, data.id, data.vote);
    await initiativeRepository.updateRatingByVote(data.id, data.vote);
    await initiativeRepository.updateHistory(data.id, data.vote);
    if (user.history.length % 50 === 0)
        await userRepository.addExperience(user, 100);
    else await userRepository.addExperience(user, 20);
    await userRepository.addExperience(creator, 5);
    return res.success(null);
};

exports.getForSwipes = async (req, res) => {
    const user = req.user;

    if(!user) {
        return res.validationError({
            errors: [{
                path: 'creator',
                message: 'User must be authorized for swiping'
            }]
        });
    }

    const initiatives = await initiativeRepository.findInitiativesForUser(user);
    return res.success(initiatives);
};
