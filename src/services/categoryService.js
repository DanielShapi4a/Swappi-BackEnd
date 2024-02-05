const Category = require('../models/Category');

async function edit(categoryId, categoryData) {
    return await Category.updateOne({ _id: categoryId }, { $set: { ...categoryData } });
}

async function getCategoryById(categoryId) {
    return await Category.findById(categoryId);
}

module.exports = {
    edit,
    getCategoryById
}