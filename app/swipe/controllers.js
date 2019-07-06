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

    //console.log(user);

    userRepository.voteForInitiative(user, data.id, data.vote);
    return res.success();
};