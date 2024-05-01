const Category = require('../models/categoryModel/mainJobCategory');

const addCategory =async( req, res) => {

    let jobCategory = req.body.categoryname 
    const categoryName = await Category.findOne({ jobcategory:jobCategory})
 
    if(categoryName){
        return res.status(404).send({
            message: "Category already exists"
        })
    }else {
        const jCategory = new Category({
            jobcategory:jobCategory
        })
       const result= await jCategory.save();
        console.log(result);
        
        res.send({
            message: "successfully",
        })
    }
}

module.exports ={
    addCategory
}