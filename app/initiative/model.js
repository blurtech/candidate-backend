const mongoose = require('mongoose');
const { Schema } = mongoose;

const definition = {
    creator: {
        type: String,
        required: [true, 'Creator required']
    },
    voters: [{type:Schema.Types.ObjectId, ref: 'User'}],
    city: {
            type: String,
            validate: {
                    validator: (v) =>  v.length < 144,
                    message: 'City must be short then 144 symbols!'
            }
    },
    title: {
        type: String,
        validate: {
            validator: (v) =>  v.length < 144,
            message: 'Title must be short then 144 symbols!'
        }
    },
    describe: {
        type: String,
        validate: {
            validator: (v) =>  v.length < 501,
            message: 'Title must be short then 500 symbols!'
        }
    }
};

const options = {
    timestamps: true
};

const InitiativeSchema = new Schema(definition, options);

module.exports = mongoose.model('Initiative', InitiativeSchema);
