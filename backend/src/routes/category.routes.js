const express = require('express');
const {
    createCategory,
    listCategories,
    getCategoryById,
} = require('../controllers/category.controller');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated category ID
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         icon:
 *           type: string
 *           description: Category icon
 *         isActive:
 *           type: boolean
 *           default: true
 *         parentCategory:
 *           type: string
 *           description: Parent category ID (for subcategories)
 *         sortOrder:
 *           type: number
 *           default: 0
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               parentCategory:
 *                 type: string
 *               sortOrder:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: parentCategory
 *         schema:
 *           type: string
 *         description: Filter by parent category ID
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/', listCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCategoryById);

module.exports = router;

