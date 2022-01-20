import express from 'express';

import { authenticateToken } from '../middleware/authorization.js';

import getAllUserParcels from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId/parcels', authenticateToken, getAllUserParcels);

export default router;
