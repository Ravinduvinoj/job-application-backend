const mongoose = require('mongoose');

const sheduleSchema = new mongoose.Schema({
    location: {
        type: 'string',
        required: true
    },
    description: {
        type: 'String',
        required: true
    },
    approvedDate: {
        type: 'Date',
        default: Date.now
    },
    interiview_date: {
        type: 'Date',
        required: true
    },
    interiview_time: {
        type: 'String',
        required: true
    },
    advertiesment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'advertiesment'
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'application'
    },
    loginID: { // Reference to the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'useraccount',
    }
  
},
    { collection: 'schedule' })
module.exports = mongoose.model("schedule", sheduleSchema);