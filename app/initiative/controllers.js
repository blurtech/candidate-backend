const repository = require('./repository');
const userRepository = require('../user/repository');

exports.create = (req, res) => {
    const data = req.body;
    const creator = req.user;

    if(!creator) {
        return res.validationError({
            errors: [{
                path: 'creator',
                message: 'Initiative needs creator'
            }]
        });
    }

    data.creator = creator.username;
    data.voters = [creator._id];

    repository.saveInitiative(data, (err, data) => {
        if (err) {
            return res.validationError(err);
        }
        userRepository.addInitiativeToUser(creator, data.id, (err) => {
            if (err) {
                return res.unprocessableEntity(err);
            }
            return res.success({message: 'Successful created new initiative'});
        });
    });
};

exports.getAll = (req, res) => {
    if (req.query.byuser && req.query.byuser === 'true') {
        console.log("worked! "+ typeof(req.query.byuser));
        return repository.findAllInitiativesByUsername(req.user.username).then((data) => {
            return res.success(data);
        }).catch((err) => {
            return res.unprocessableEntity(err);
        })
    }
    else {
        return repository.findAllInitiatives().then((data) => {
            return res.success(data);
        }).catch((err) => {
            return res.unprocessableEntity(err);
        });
    }
};

exports.getOne = (req, res) => {
    const initiativeId = req.params.id;
    return repository.findInitiativeByID(initiativeId).then((initiative) => {
        if (!initiative) {
            return res.notFound();
        }
        userRepository.findUsernamesById(initiative.voters)
        .then(usernames => {
            return res.success({initiative, usernames});
        });
    }).catch((err) => {
        return res.unprocessableEntity(err);
    });
};

exports.edit = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    return repository.findInitiativeByID(id)
    .then((initiative) => {
        if (!initiative) {
            return res.notFound();
        }
        return repository.editInitiative(initiative, data, (err) => {
            if (err) {
                return res.validationError(err);
            }
            return res.success({message: 'Successful edit initiative'});
        });
    }).catch((err) => {
        return res.unprocessableEntity(err);
    }); 
};
