const userRepository = require('../user/repository');
const initiativeRepository = require('../initiative/repository');

exports.getInitiativesByOrg = async (req, res) => {
    const username = req.params.username;
    const status = (await userRepository.findUserByUsername(username)).isOrg;

    if(!status) {
        return res.validationError({
            errors: [{
                path: 'isOrg',
                message: 'This user not organization'
            }]
        });
    }

    if(!username) {
        return res.validationError({
            errors: [{
                path: 'creator',
                message: 'Organisation not found'
            }]
        });
    }

    const initiatives = await initiativeRepository.findAllInitiativesByUsername(username);
    !initiatives.length ? res.notFound() : res.success(initiatives);
};
