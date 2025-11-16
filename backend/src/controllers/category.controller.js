const mongoose = require('mongoose');
const Category = require('../models/category.model');
const { AppError, asyncHandler } = require('../middlewares/error.middleware');

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Public (can be changed to private/admin based on requirements)
 */
const createCategory = asyncHandler(async (req, res, next) => {
    const { name, description, icon, parentCategory, sortOrder } = req.body;

    // Validate required fields
    if (!name) {
        return next(new AppError('Category name is required', 400));
    }

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return next(new AppError('Category with this name already exists', 400));
    }

    // Validate parentCategory if provided
    if (parentCategory && !mongoose.Types.ObjectId.isValid(parentCategory)) {
        return next(new AppError('Invalid parent category ID format', 400));
    }

    // Check if parent category exists (if provided)
    if (parentCategory) {
        const parentExists = await Category.findById(parentCategory);
        if (!parentExists) {
            return next(new AppError('Parent category does not exist', 404));
        }
    }

    // Create category
    const category = await Category.create({
        name,
        description,
        icon,
        parentCategory: parentCategory || null,
        sortOrder: sortOrder || 0,
    });

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: {
            category,
        },
    });
});

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
const listCategories = asyncHandler(async (req, res, next) => {
    const { isActive, parentCategory } = req.query;

    // Build query
    const query = {};

    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }

    if (parentCategory) {
        if (mongoose.Types.ObjectId.isValid(parentCategory)) {
            query.parentCategory = parentCategory;
        } else {
            return next(new AppError('Invalid parent category ID format', 400));
        }
    } else {
        // If no parentCategory specified, show only top-level categories by default
        // You can remove this if you want all categories
        query.parentCategory = null;
    }

    const categories = await Category.find(query)
        .populate('parentCategory', 'name')
        .sort({ sortOrder: 1, name: 1 })
        .lean();

    res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: {
            categories,
            count: categories.length,
        },
    });
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid category ID format', 400));
    }

    const category = await Category.findById(id).populate('parentCategory', 'name');

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: {
            category,
        },
    });
});

module.exports = {
    createCategory,
    listCategories,
    getCategoryById,
};

