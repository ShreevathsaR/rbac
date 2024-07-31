const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const ProjectModel = mongoose.model("projects", ProjectSchema);

module.exports = ProjectModel;