const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({

    projectPoster: {
        type: String,
        required: true
    },
    projectPosterPublicId: {
        type: String,
        required: true
    },
    pdf: {
        type: String,
        required: true
    },
    pdfPublicId: {
        type: String,
        required: true
    },
    ProjectName: {
        type: String,
        required: true,
    },
    AuthorName: {
        type: String,
        required: true
    },
    abstract: {
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
    Type: {
        type: String,
        required: true  
    },
    project_vision: {
        type: String,
        required: true
    },
    mission_statement: {
        type: String,
        required: true
    },
    team_size: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    accepted: {
        type: Boolean,
        required: true
    },
    likes: {
        type: Number,
        required: true
    }
}, { timestamps: true})

module.exports = mongoose.model('Project', ProjectSchema);