const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    Name: {
        type: 'string',
        required: true
    },
    Address: {
        type: 'Date',
        required: true
    },
    City: {
        type: 'string',
        required: true
    },
    DOB: {
        type: 'Date',
        required: true
    },
    Gender: {
        type: 'string'

    },
    // Resume: {
    //     type: 'string',
    //     required: true
    // },
    Contact: {
        type: 'string',

    },
    country: {
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
       default:'pending'
    },
    Submission_date: {
        type: 'string',
        default: Date.now
    },
    advertiesment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'advertiesment'
    },
    jobseeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobseeker'
    }


}, { collection: 'application' })
module.exports = mongoose.model("application", ApplicationSchema);

