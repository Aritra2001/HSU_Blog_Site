const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AudioBookSchema = new Schema({

    audioBookPoster: {
        type: String,
        required: true
    },
    audioBookPosterPublicId: {
        type: String,
        required: true
    },
    audio: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    audioPublicId: {
        type: String,
        required: true
    },
    AudioBookName: {
        type: String,
        required: true,
    },
    AuthorName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type:[String],
        required: true
    },
    permalink: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    color: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true 
    },
    likes: {
        type: Number,
        required: true
    }
}, { timestamps: true})

module.exports = mongoose.model('AudioBook', AudioBookSchema);