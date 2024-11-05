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

  async searchRequisitions(
    userId?: number,
    purpose?: string,
    destination?: string,
    dateRequired?: { from?: Date; to?: Date },
    returnDate?: { from?: Date; to?: Date },
    numberOfPassengers?: { from?: number; to?: number },
    status?: 'PENDING' | 'HOD_APPROVED' | 'CHAIRMAN_APPROVED' | 'VC_APPROVED' | 'REJECTED' | 'COMPLETED',
    contactNumber?: string,
    vehicleId?: number,
    driverId?: number,
    sort?: { field: keyof Requisition; direction: 'asc' | 'desc' },
    page?: number,
    limit?: number
  ): Promise<{ requisitions: Requisition[]; totalCount: number }> {
    return this.requisitionRepository.search(
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
      page,
      limit
    );
  }
}