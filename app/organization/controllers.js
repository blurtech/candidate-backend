const userRepository = require('../user/repository');
const initiativeRepository = require('../initiative/repository');

exports.getAllOrgsInitiatives = async (req, res) => {
    const data = await initiativeRepository.getAllOrgsInitiatives();
    return res.success(data);
};

exports.getInitiativesByOrg = async (req, res) => {
    const username = req.params.username;

    if(!username) {
        return res.validationError({
            errors: [{
                path: 'creator',
                message: 'Organisation not found'
            }]
        });
    }

    const status = (await userRepository.findUserByUsername(username));
    if(!status || !status.isOrg) {
        return res.validationError({
            errors: [{
                path: 'isOrg',
                message: 'This user not organization'
            }]
        });
    }

    const initiatives = await initiativeRepository.findAllInitiativesByUsername(username);
    !initiatives.length ? res.notFound() : res.success(initiatives);
};
