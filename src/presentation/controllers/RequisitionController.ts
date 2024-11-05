import { Request, Response } from 'express';
import { RequisitionService } from '../../application/services/RequisitionService';
import { Requisition } from '../../core/domain/Requisition';

export class RequisitionController {
  private requisitionService: RequisitionService;

  constructor() {
    this.requisitionService = new RequisitionService();
  }

  async createRequisition(req: Request, res: Response): Promise<void> {
    try {
      const requisition = await this.requisitionService.createRequisition(req.body);
      res.status(201).json(requisition);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getRequisitionById(req: Request, res: Response): Promise<void> {
    try {
      const requisition = await this.requisitionService.getRequisitionById(Number(req.params.id));
      if (!requisition) {
        res.status(404).json({ message: 'Requisition not found' });
        return;
      }
      res.json(requisition);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getRequisitionsByUserId(req: Request, res: Response): Promise<void> {
    console.log(`getting requisitions by user id controller`);
    try {
      const requisitions = await this.requisitionService.getRequisitionsByUserId(Number(req.params.userId));
      res.json(requisitions);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async updateRequisition(req: Request, res: Response): Promise<void> {
    try {
      const requisition = await this.requisitionService.updateRequisition(Number(req.params.id), req.body);
      res.json(requisition);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteRequisition(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.requisitionService.deleteRequisition(Number(req.params.id));
      if (!success) {
        res.status(404).json({ message: 'Requisition not found' });
        return;
      }
      res.json({ message: 'Requisition deleted' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async searchRequisitions(req: Request, res: Response): Promise<void> {
    try {
      const {
        userId,
        purpose,
        destination,
        dateRequired,
        returnDate,
        numberOfPassengers,
        status,
        contactNumber,
        vehicleId,
        driverId,
        sort,
        page = 1,
        limit = 10,
      } = req.query;

      const { requisitions, totalCount } = await this.requisitionService.searchRequisitions(
        userId ? Number(userId) : undefined,
        purpose as string | undefined,
        destination as string | undefined,
        dateRequired
          ? {
              from: dateRequired.toString().split(',')[0] ? new Date(dateRequired.toString().split(',')[0]) : undefined,
              to: dateRequired.toString().split(',')[1] ? new Date(dateRequired.toString().split(',')[1]) : undefined,
            }
          : undefined,
        returnDate
          ? {
              from: returnDate.toString().split(',')[0] ? new Date(returnDate.toString().split(',')[0]) : undefined,
              to: returnDate.toString().split(',')[1] ? new Date(returnDate.toString().split(',')[1]) : undefined,
            }
          : undefined,
        numberOfPassengers
          ? {
              from: numberOfPassengers.toString().split(',')[0] ? Number(numberOfPassengers.toString().split(',')[0]) : undefined,
              to: numberOfPassengers.toString().split(',')[1] ? Number(numberOfPassengers.toString().split(',')[1]) : undefined,
            }
          : undefined,
        status as 'PENDING' | 'HOD_APPROVED' | 'CHAIRMAN_APPROVED' | 'VC_APPROVED' | 'REJECTED' | 'COMPLETED' | undefined,
        contactNumber as string | undefined,
        vehicleId ? Number(vehicleId) : undefined,
        driverId ? Number(driverId) : undefined,
        sort
          ? {
              field: sort.toString().split(',')[0] as keyof Requisition,
              direction: sort.toString().split(',')[1] as 'asc' | 'desc',
            }
          : undefined,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined
      );

      res.json({ requisitions, totalCount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
}