import { Router } from 'express';
import { RequisitionController } from '../controllers/RequisitionController';
import { auth, authorize } from '../middlewares/authorizer';

const router = Router();
const requisitionController = new RequisitionController();

router.get('/', auth, authorize(['FACULTY', 'HOD', 'CHAIRMAN', 'VC', 'ADMIN']), (req, res) => 
    requisitionController.searchRequisitions(req, res));

router.post('/', auth, authorize(['FACULTY', 'HOD', 'CHAIRMAN', 'VC', 'ADMIN']), (req, res) => 
    requisitionController.createRequisition(req, res));

router.put('/:id', auth, authorize(['ADMIN']), (req, res) => 
    requisitionController.updateRequisition(req, res));

router.delete('/:id', auth, authorize(['CHAIRMAN', 'ADMIN']), (req, res) => 
    requisitionController.deleteRequisition(req, res));

router.put('/:id/vehicle-driver', auth, authorize(['ADMIN', 'TRANSPORT_OFFICER']), (req, res) => 
    requisitionController.assignVehicleAndDriver(req, res));

router.put('/:id/approve/hod', auth, authorize(['ADMIN', 'HOD']), (req, res) => 
    requisitionController.approveByHOD(req, res));

router.put('/:id/approve/chairman', auth, authorize(['ADMIN', 'CHAIRMAN']), (req, res) => 
    requisitionController.approveByChairman(req, res));

router.put('/:id/approve/vc', auth, authorize(['ADMIN', 'VC']), (req, res) => 
    requisitionController.approveByVC(req, res));

router.put('/:id/reject', auth, authorize(['ADMIN', 'HOD', 'CHAIRMAN', 'VC']), (req, res) => 
    requisitionController.rejectRequisition(req, res));

router.put('/:id/update-data', auth, authorize(['ADMIN', 'FACULTY']), (req, res) => 
    requisitionController.updateRequisitionData(req, res));

export default router;