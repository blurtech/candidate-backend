const mongoose = require('mongoose');
const { Schema } = mongoose;

const definition = {
    creator: {
        type: String,
        required: [true, 'Creator required']
    },
    title: {
        type: String,
        validate: {
            validator: (v) =>  v.length < 100,
            message: 'Title must be short then 100 symbols!'
        }
    },
    describe: {
        type: String
    },
    voters: [{type:Schema.Types.ObjectId, ref: 'User'}],
    rating: {
        type: Number,
        default: 0
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
    history: [
        {
            dateOfVoting: {
                type: Date
            },
            vote: {
                type: String,
                enum : ['Like', 'Dislike', 'Superlike']
            }
        }],
};

const options = {
    timestamps: true
};

const InitiativeSchema = new Schema(definition, options);

module.exports = mongoose.model('Initiative', InitiativeSchema);
