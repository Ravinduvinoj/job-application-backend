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

const delete_category = async (req, res) => {
    const jCategory = req.params.jobCategory;
    try {
        const deleteCat = await Category.findOneAndDelete({ jobcategory: jCategory });

        if (!deleteCat) {
            return res.status(404).send({ message: 'Job Category not found' });
        }

        res.status(200).send({ message: 'job category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send({ message: 'Internal server error' });
    }

}
module.exports = {
    addCategory,
    getAllJobCategory,
    delete_category
}