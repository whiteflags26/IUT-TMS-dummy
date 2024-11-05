import { Router } from 'express';
import { RequisitionController } from '../controllers/RequisitionController';
import { auth, authorize } from '../middlewares/auth';

const router = Router();
const requisitionController = new RequisitionController();

router.get('/', auth, authorize(['FACULTY', 'HOD', 'CHAIRMAN', 'VC', 'ADMIN']), (req, res) => 
    requisitionController.searchRequisitions(req, res));

router.post('/', auth, authorize(['FACULTY', 'HOD', 'CHAIRMAN', 'VC', 'ADMIN']), (req, res) => 
    requisitionController.createRequisition(req, res));

router.put('/:id', auth, authorize(['FACULTY', 'HOD', 'CHAIRMAN', 'VC', 'ADMIN']), (req, res) => 
    requisitionController.updateRequisition(req, res));

router.delete('/:id', auth, authorize(['CHAIRMAN', 'ADMIN']), (req, res) => 
    requisitionController.deleteRequisition(req, res));

export default router;