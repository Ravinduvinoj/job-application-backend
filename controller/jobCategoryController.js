const Category = require('../models/categoryModel/mainJobCategory');

const addCategory = async (req, res) => {

    let jobCategory = req.body.categoryname
    const categoryName = await Category.findOne({ jobcategory: jobCategory })

    if (categoryName) {
        return res.status(404).send({
            message: "Category already exists"
        })
    } else {
        const jCategory = new Category({
            jobcategory: jobCategory
        })
        const result = await jCategory.save();
        console.log(result);

        res.send({
            message: "successfully",
        })
    }
}
const getAllJobCategory = async (req, res) => {
    try {
        // Fetch all user accounts from the database
        const jcategory = await Category.find();

        res.status(200).json(jcategory);
    } catch (error) {
        console.error('Error fetching job categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// const delete_category = async (req, res) => {
//     const jCategory = req.params.jobCategory;
//     try {
//         const deleteCat = await Category.findOneAndDelete({ jobcategory: jCategory });

//         if (!deleteCat) {
//             return res.status(404).send({ message: 'Job Category not found' });
//         }

//         res.status(200).send({ message: 'job category deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// }

    const updateCategory = async (req, res) => {
        const oldCategoryName = req.params.jobCategory;
        const newCategoryName = req.body.jobcategory;
    
        try {
            // Find the category to be updated
            const category = await Category.findOne({ jobcategory: oldCategoryName });
    
            // Check if the category exists
            if (!category) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
    
            // Check if the new category name already exists
            const existingCategory = await Category.findOne({ jobcategory: newCategoryName });
            if (existingCategory) {
                return res.status(409).json({
                    message: "Category already exists"
                });
            }
    
            // Update the category name
            category.jobcategory = newCategoryName;
            const updatedCategory = await category.save();
    
            res.json({
                message: "Category updated successfully",
                updatedCategory: updatedCategory
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "Internal server error"
            });
        }
    }

    

module.exports = {
    addCategory,
    getAllJobCategory,
    updateCategory
}