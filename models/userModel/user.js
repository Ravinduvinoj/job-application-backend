const mongoose = require('mongoose');

const usersschema = new mongoose.Schema({
    company:{
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
    address: {
        type: 'string',
        required: true
    },
    companyurl: {
        type:'string',
        required: true
    }

},{ collection: 'useraccount' })
module.exports = mongoose.model("User", usersschema);