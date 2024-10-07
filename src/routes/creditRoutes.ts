import express from 'express';
import { CreditController } from '../controllers/creditController';
import { authenticateToken, authenticateAdmin } from '../middleware/auth';

const router = express.Router();
const creditController = new CreditController();

/**
 * @swagger
 * /api/credits/apply:
 *   post:
 *     summary: Apply for a credit application
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of credit requested
 *     responses:
 *       201:
 *         description: Credit application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/CreditApplication'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.post('/apply', authenticateToken, (req, res) =>
  creditController.applyCreditApplication(req, res),
);

/**
 * @swagger
 * /api/credits:
 *   get:
 *     summary: Get all credit applications (admin only)
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all credit applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CreditApplication'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateAdmin, (req, res) => creditController.getCreditApplications(req, res));

/**
 * @swagger
 * /api/credits/{id}:
 *   put:
 *     summary: Update a credit application status (admin only)
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The credit application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Credit application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/CreditApplication'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateAdmin, (req, res) =>
  creditController.updateCreditApplication(req, res),
);

/**
 * @swagger
 * /api/credits/my-applications:
 *   get:
 *     summary: Get credit applications for the authenticated student
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of credit applications for the authenticated student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CreditApplication'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/my-applications', authenticateToken, (req, res) =>
  creditController.getStudentCreditApplications(req, res),
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreditApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         student:
 *           $ref: '#/components/schemas/Student'
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 */
