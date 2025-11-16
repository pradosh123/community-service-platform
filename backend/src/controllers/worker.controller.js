const mongoose = require('mongoose');
const Worker = require('../models/worker.model');
const Category = require('../models/category.model');
const { AppError, asyncHandler } = require('../middlewares/error.middleware');
const NotificationService = require('../services/notification.service');

/**
 * @route   POST /api/workers
 * @desc    Register a new worker
 * @access  Public (can be changed to private based on requirements)
 */
const registerWorker = asyncHandler(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        category,
        skills,
        experience,
        hourlyRate,
        availability,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !category || !hourlyRate) {
        return next(new AppError('Please provide all required fields: firstName, lastName, email, phoneNumber, category, and hourlyRate', 400));
    }

    // Validate address required fields
    if (!address || !address.city || !address.state) {
        return next(new AppError('Address with city and state is required', 400));
    }

    // Validate category is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(new AppError('Invalid category ID format. Category must be a valid MongoDB ObjectId', 400));
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        return next(new AppError(`Category with ID ${category} does not exist`, 404));
    }

    // Check if category is active
    if (!categoryExists.isActive) {
        return next(new AppError('The selected category is not active', 400));
    }

    // Check if worker with email already exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
        return next(new AppError('Worker with this email already exists', 400));
    }

    // Check if worker with phone number already exists
    const existingWorkerPhone = await Worker.findOne({ phoneNumber });
    if (existingWorkerPhone) {
        return next(new AppError('Worker with this phone number already exists', 400));
    }

    // Validate hourly rate
    if (hourlyRate < 0) {
        return next(new AppError('Hourly rate cannot be negative', 400));
    }

    // Create new worker
    const worker = await Worker.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        category,
        skills: skills || [],
        experience: experience || 0,
        hourlyRate,
        availability: availability || 'on-demand',
    });

    // Send registration confirmation notification
    try {
        await NotificationService.sendWorkerRegistrationConfirmation(
            phoneNumber,
            firstName
        );
    } catch (error) {
        // Log but don't fail registration if notification fails
        console.error('Failed to send registration notification:', error);
    }

    res.status(201).json({
        success: true,
        message: 'Worker registered successfully',
        data: {
            worker,
        },
    });
});

/**
 * @route   GET /api/workers
 * @desc    Get all workers with filtering and pagination
 * @access  Public
 */
const listWorkers = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        status,
        category,
        city,
        state,
        availability,
        minRating,
        isActive,
        search,
    } = req.query;

    // Build query
    const query = {};

    if (status) {
        query.status = status;
    }

    if (category) {
        // Validate category is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        } else {
            return next(new AppError('Invalid category ID format', 400));
        }
    }

    if (city) {
        query['address.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
        query['address.state'] = { $regex: state, $options: 'i' };
    }

    if (availability) {
        query.availability = availability;
    }

    if (minRating) {
        query.rating = { $gte: parseFloat(minRating) };
    }

    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
        ];
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [workers, total] = await Promise.all([
        Worker.find(query)
            .populate('category', 'name description')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Worker.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
        success: true,
        message: 'Workers retrieved successfully',
        data: {
            workers,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalWorkers: total,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        },
    });
});

/**
 * @route   GET /api/workers/:id
 * @desc    Get single worker by ID
 * @access  Public
 */
const getWorkerById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const worker = await Worker.findById(id).populate('category', 'name description');

    if (!worker) {
        return next(new AppError('Worker not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Worker retrieved successfully',
        data: {
            worker,
        },
    });
});

/**
 * @route   DELETE /api/workers/:id
 * @desc    Delete a worker
 * @access  Private (Admin)
 */
const deleteWorker = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const worker = await Worker.findById(id);

    if (!worker) {
        return next(new AppError('Worker not found', 404));
    }

    await Worker.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Worker deleted successfully',
        data: {},
    });
});

/**
 * @route   PUT /api/workers/:id
 * @desc    Update a worker
 * @access  Private (Admin or Worker themselves)
 */
const updateWorker = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating certain fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const worker = await Worker.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
            new: true,
            runValidators: true,
        }
    ).populate('category', 'name description');

    if (!worker) {
        return next(new AppError('Worker not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Worker updated successfully',
        data: {
            worker,
        },
    });
});

module.exports = {
    registerWorker,
    listWorkers,
    getWorkerById,
    deleteWorker,
    updateWorker,
};

