const mongoose = require('mongoose');
const { Schema } = mongoose;

const definition = {
    creator: {
        type: String,
        required: [true, 'Creator required']
    },
    voters: [{type:Schema.Types.ObjectId, ref: 'User'}],
    city: {
            type: String
    },
    title: {
        type: String
    },
    describe: {
        type: String
    }
};

const options = {
    timestamps: true
};

const InitiativeSchema = new Schema(definition, options);

module.exports = mongoose.model('Initiative', InitiativeSchema);
