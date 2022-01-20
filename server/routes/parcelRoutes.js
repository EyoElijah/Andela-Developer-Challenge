import express from 'express';

import { authenticateToken, isAdmin, createdBy } from '../middleware/authorization.js';

import {
  validateParcelInput,
  validateStatusInput,
  validateCancelInput,
  handleValitaionError,
} from '../middleware/validation.js';
import {
  createParcel,
  getAllParcels,
  specificParcel,
  cancelParcel,
  destinationParcel,
  statusParcel,
  currentLocationParcel,
} from '../controllers/parcelController.js';

const router = express.Router();

router.post('/', authenticateToken, validateParcelInput, handleValitaionError, createParcel);
router.get('/', authenticateToken, isAdmin, getAllParcels);
router.get('/:parcelId', authenticateToken, specificParcel);
router.patch(
  '/:parcelId/cancel',
  authenticateToken,
  createdBy,
  validateCancelInput,
  handleValitaionError,
  cancelParcel
);
router.patch(
  '/:parcelId/destination',
  authenticateToken,
  createdBy,
  validateParcelInput[3],
  handleValitaionError,
  destinationParcel
);
router.patch(
  '/:parcelId/status',
  authenticateToken,
  isAdmin,
  validateStatusInput,
  handleValitaionError,
  statusParcel
);
router.patch('/:parcelId/currentLocation', authenticateToken, isAdmin, currentLocationParcel);

export default router;
