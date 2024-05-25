const mongoose = require('mongoose');

const tempadvertiesmentSchema = new mongoose.Schema({
    job_title: {
        type: 'string',
        required: true
    },
    job_description: {
        type: 'string',
        required: true
    },
    ad_closing_date: {
        type: 'Date',
        required: true
    },
    position_summary: {
        type: 'string'

    },
    // add_file: {
    //     type: 'string',
    //     required: true
    // },
    requirement1: {
        type: 'string',

    },
    requirement2: {
        type: 'string',

    },
    country: {
        type: 'string',
        required: true
    },
    city: {
        type: 'string',
        required: true
    },
    post_date: {
        type: 'Date',
        default: Date.now
    },
    JobCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobCategory'
    },
    jobsubcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobsubcategory'
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: 'string'
    }


},{ collection: 'tempadvertiesment' })
module.exports = mongoose.model("tempadvertiesment", tempadvertiesmentSchema);

