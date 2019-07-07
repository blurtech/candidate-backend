const userRepository = require('../user/repository');
const initiativeRepository = require('../initiative/repository');

exports.swipe = (req, res) => {
    const data = req.body;
    const user = req.user;

    if(!user) {
        return res.validationError({
            errors: [{
                path: 'creator',
                message: 'User must swipe initiative'
            }]
        });
    }

    userRepository.voteForInitiative(user, data.id, data.vote);
    initiativeRepository.updateRatingByVote(data.id, data.vote);

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
