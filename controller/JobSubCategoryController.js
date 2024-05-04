 const addSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subcategoryName } = req.body;

        // Find the main category by ID
        const mainCategory = await JobCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        // Add the subcategory to the main category
        mainCategory.subcategories.push(subcategoryName);
        await mainCategory.save();

        res.status(201).json({ message: 'Subcategory added successfully' });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addSubCategory
}
