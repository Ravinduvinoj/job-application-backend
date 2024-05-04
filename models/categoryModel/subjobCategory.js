const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    jobsubcategory:{
        type : 'string',
        required : true
    },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobcategory'
    }

},{ collection: 'jobsubcategory' })
module.exports = mongoose.model("jobsubcategory", subcategorySchema);

