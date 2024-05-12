const mongoose = require('mongoose');

const usersschema = new mongoose.Schema({
    job_Seeker_Name:{
        type : 'string',
        required : true
    },
    contact: {
        type :'number',
        required : true
    },
    email: {
        type :'string',
        unique : true,
        required : true
    },
    password : {
        type :'string',
        required : true
    },
    userRole :{
        type :'string',
        required : true
    },
    city: {
        type: 'string',
        required: true
    },
    dob: {
        type: 'Date',
        required: true
    },
    address: {
        type: 'string',
        required: true
    }

},{ collection: 'useraccount' })
module.exports = mongoose.model("User", usersschema);