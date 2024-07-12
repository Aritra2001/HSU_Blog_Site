const mongoose = require('mongoose');
const { type } = require('os');
const { default: isEmail } = require('validator/lib/isEmail');

const Schema = mongoose.Schema

const ResourceSchema = new Schema(
    {
        pdfPoster: {
            type: String,
            required: true
        },
        pdfPosterPubclidId: {
            type: String,
            required: true
        },
        pdf: {
            type: String,
            required: true
        },
        pdfPubclidId: {
            type: String,
            required: true
        },
        resourceName: {
            type: String,
            required: true,
        },
        uploaderName: {
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
        phone: {
            type: Number,
            required: true
        },
        accepted: {
            type: Boolean,
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
    }, { timestamps: true}
)

module.exports = mongoose.model('ResourceList', ResourceSchema);