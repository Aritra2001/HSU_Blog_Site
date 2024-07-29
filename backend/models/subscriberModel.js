const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SubscriberSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('subscriber', SubscriberSchema)