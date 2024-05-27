const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    address: {
        type: 'String',
        required: true
    },
    city: {
        type: 'string',
        required: true
    },
    dob: {
        type: 'Date',
        required: true
    },
    gender: {
        type: 'string'
    },
    // Resume: {
    //     type: 'string',
    //     required: true
    // },
    contact: {
        type: 'Number',
    },
    // country: {
    //     type: 'string',
    //     required: true
    // },
    status: {
        type: 'string',
       default:'pending'
    },
    Submission_date: {
        type: 'Date',
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
},
{ collection: 'application' })
module.exports = mongoose.model("application", ApplicationSchema);