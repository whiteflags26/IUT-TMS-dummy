import { Request, Response } from 'express';
import { RequisitionService } from '../../application/services/RequisitionService';

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
}