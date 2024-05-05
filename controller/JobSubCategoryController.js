const subcategory = require('../models/categoryModel/subjobCategory')
const Category = require('../models/categoryModel/mainJobCategory');
const addSubCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId; // Access the ID property
        const subcategoryName = req.body.SubCategory; // Assuming subcategoryName is the key for subcategory name in req.body
        console.log(categoryId)
        console.log(subcategoryName)

        const mainCategory = await Category.findById(categoryId);
        const checkCategory = await subcategory.findOne({
            $and: [
                { jobsubcategory: subcategoryName },
                { JobCategory: categoryId }
            ]
        });

        if (!mainCategory) {
            return res.status(404).json({ message: 'Category not found' });
        } else if (checkCategory) {
            return res.status(400).json({ message: 'This subcategory for the category already exists' });
        }

        const subcat = new subcategory({
            jobsubcategory: subcategoryName,
            JobCategory: categoryId
        });

        const result = await subcat.save();
        console.log(result);
        res.status(201).json({ message: 'Subcategory added successfully' });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllSubJobCategory = async (req, res) => {
    try {
        // Fetch all user accounts from the database
        const subcategories = await subcategory.find().populate('JobCategory', 'jobcategory');

        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error fetching job sub categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateSubCategory = async (req, res) => {
    const oldSubCategoryName = req.params.subcategory;
    const mainCategoryId = req.body.maincatID;
    const newSubCategoryName = req.body.jobsubcategory;
    console.log(oldSubCategoryName)
    console.log(mainCategoryId)
    console.log(newSubCategoryName)
    try {
        
        const subcategoryToUpdate = await subcategory.findOne({ jobsubcategory: oldSubCategoryName });
        const checkMainCategory = await Category.findById(mainCategoryId);
        const existingSubCategory = await subcategory.findOne({ jobsubcategory: newSubCategoryName });
        
        if (!subcategoryToUpdate) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        if (existingSubCategory) {
            return res.status(409).json({
                message: "Subcategory already exists"
            });
        }

        if (!checkMainCategory) {
            return res.status(409).json({
                message: "Main Category not found"
            });
        }

        subcategoryToUpdate.jobsubcategory = newSubCategoryName;
        subcategoryToUpdate.JobCategory = mainCategoryId;

        const updatedSubcategory = await subcategoryToUpdate.save();
    
        res.json({
            message: "Subcategory updated successfully",
            updatedSubcategory: updatedSubcategory
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Internal server error"
        });
    }
}

module.exports = {
    addSubCategory,
    getAllSubJobCategory,
    updateSubCategory
};
