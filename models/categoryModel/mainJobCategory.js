const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    jobcategory:{
        type : 'string',
        required : true
    }
},{ collection: 'jobcategory' })
module.exports = mongoose.model("JobCategory", categorySchema);