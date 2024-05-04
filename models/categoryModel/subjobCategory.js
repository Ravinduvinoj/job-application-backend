const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    jobsubcategory:{
        type : 'string',
        required : true
    },
    JobCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobCategory'
    }

},{ collection: 'jobsubcategory' })
module.exports = mongoose.model("jobsubcategory", subcategorySchema);

