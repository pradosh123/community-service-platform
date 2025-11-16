const express = require('express');
const {
    registerWorker,
    listWorkers,
    getWorkerById,
    deleteWorker,
    updateWorker,
} = require('../controllers/worker.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - address
 *         - category
 *         - hourlyRate
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated worker ID
 *         firstName:
 *           type: string
 *           description: Worker's first name
 *         lastName:
 *           type: string
 *           description: Worker's last name
 *         email:
 *           type: string
 *           format: email
 *           description: Worker's email address
 *         phoneNumber:
 *           type: string
 *           description: Worker's phone number
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         category:
 *           type: string
 *           description: Category ID
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: number
 *           description: Years of experience
 *         hourlyRate:
 *           type: number
 *           description: Hourly rate in USD
 *         availability:
 *           type: string
 *           enum: [full-time, part-time, on-demand]
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Register a new worker
 *     tags: [Workers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - address
 *               - category
 *               - hourlyRate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: object
 *                 required:
 *                   - city
 *                   - state
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *                     default: USA
 *               category:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: number
 *                 default: 0
 *               hourlyRate:
 *                 type: number
 *               availability:
 *                 type: string
 *                 enum: [full-time, part-time, on-demand]
 *                 default: on-demand
 *     responses:
 *       201:
 *         description: Worker registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     worker:
 *                       $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', registerWorker);

/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Get all workers with filtering and pagination
 *     tags: [Workers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, on-demand]
 *         description: Filter by availability
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, email, or phone
 *     responses:
 *       200:
 *         description: Workers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     workers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Worker'
 *                     pagination:
 *                       type: object
 */
router.get('/', listWorkers);

/**
 * @swagger
 * /api/workers/{id}:
 *   get:
 *     summary: Get worker by ID
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker retrieved successfully
 *       404:
 *         description: Worker not found
 */
router.get('/:id', getWorkerById);

/**
 * @swagger
 * /api/workers/{id}:
 *   put:
 *     summary: Update a worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               hourlyRate:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, suspended]
 *     responses:
 *       200:
 *         description: Worker updated successfully
 *       404:
 *         description: Worker not found
 */
router.put('/:id', authenticate, updateWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   delete:
 *     summary: Delete a worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker deleted successfully
 *       404:
 *         description: Worker not found
 */
router.delete('/:id', authenticate, authorize('admin'), deleteWorker);

module.exports = router;

