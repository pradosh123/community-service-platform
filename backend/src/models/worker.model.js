const mongoose = require('mongoose');

/**
 * Worker Schema
 * Represents service workers in the platform
 */
const workerSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
            index: true,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number'],
            index: true,
        },
        address: {
            street: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                required: [true, 'City is required'],
                trim: true,
            },
            state: {
                type: String,
                required: [true, 'State is required'],
                trim: true,
            },
            zipCode: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                default: 'USA',
                trim: true,
            },
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
            index: true,
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        experience: {
            type: Number,
            default: 0,
            min: [0, 'Experience cannot be negative'],
        },
        hourlyRate: {
            type: Number,
            required: [true, 'Hourly rate is required'],
            min: [0, 'Hourly rate cannot be negative'],
        },
        availability: {
            type: String,
            enum: ['full-time', 'part-time', 'on-demand'],
            default: 'on-demand',
        },
        rating: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be negative'],
            max: [5, 'Rating cannot exceed 5'],
        },
        totalJobs: {
            type: Number,
            default: 0,
            min: 0,
        },
        completedJobs: {
            type: Number,
            default: 0,
            min: 0,
        },
        profileImage: {
            type: String,
            default: null,
        },
        documents: [
            {
                type: {
                    type: String,
                    enum: ['license', 'certificate', 'id', 'other'],
                },
                url: String,
                name: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'suspended'],
            default: 'pending',
        },
        verificationNotes: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
workerSchema.index({ email: 1 });
workerSchema.index({ phoneNumber: 1 });
workerSchema.index({ category: 1 });
workerSchema.index({ status: 1 });
workerSchema.index({ isActive: 1 });
workerSchema.index({ city: 1, state: 1 });
workerSchema.index({ createdAt: -1 });

// Virtual for full name
workerSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
workerSchema.set('toJSON', {
    virtuals: true,
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;

