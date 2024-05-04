const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    jobcategory:{
        type : 'string',
        required : true
    },
    subcategories: [{
        type: 'String'
    }]

},{ collection: 'jobcategory' })
module.exports = mongoose.model("JobCategory", categorySchema);
