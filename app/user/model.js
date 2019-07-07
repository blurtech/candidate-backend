const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    bcrypt = require('bcrypt-nodejs');

const initative = require('../initiative/model');

const { Schema } = mongoose;

const definition = {
    username: {
        type: String,
        unique: true,
        required: [true, 'Username required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    geo: {
        city: {
            type: String,
            required: [true, 'City required']
        },
        district: {
            type: String,
            required: [true, 'District required']
        }
    },
    preferences: [String],
    history: [
        {
            initiative: {type:Schema.Types.ObjectId, ref: 'Initiative'},
            vote: {
                type: String,
                enum : ['Like', 'Dislike', 'Superlike']
            }
        }],
    isOrg: {
        type: Boolean,
        default: false
    },
    token: String
};

const options = {
    timestamps: true
};

const UserSchema = new Schema(definition, options);

UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.verifyPassword = function (password, cb) {
    return new Promise((resolve, reject) => bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return reject(err);
        }
        resolve(isMatch);
    }));
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
