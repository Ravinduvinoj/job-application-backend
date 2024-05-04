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

module.exports = {
    addSubCategory
};
