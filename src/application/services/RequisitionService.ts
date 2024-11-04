import { Requisition } from '../../core/domain/Requisition';
import { IRequisitionRepository } from '../../core/interfaces/IRequisitionRepository';
import { RequisitionRepository } from '../../infrastructure/repositories/RequisitionRepository';

export class RequisitionService {
  private requisitionRepository: IRequisitionRepository;

  constructor() {
    this.requisitionRepository = new RequisitionRepository();
  }

  async createRequisition(requisition: Requisition): Promise<Requisition> {
    return this.requisitionRepository.create(requisition);
  }

  async getRequisitionById(id: number): Promise<Requisition | null> {
    return this.requisitionRepository.findById(id);
  }

  async getRequisitionsByUserId(userId: number): Promise<Requisition[]> {
    return this.requisitionRepository.findByUserId(userId);
  }

  async updateRequisition(id: number, requisition: Partial<Requisition>): Promise<Requisition> {
    return this.requisitionRepository.update(id, requisition);
  }

  async deleteRequisition(id: number): Promise<boolean> {
    return this.requisitionRepository.delete(id);
  }
}