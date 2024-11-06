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

  async assignVehicleAndDriver(
    requisitionId: number,
    vehicleId: number,
    driverId: number
  ): Promise<Requisition> {
    const existingRequisition = await this.requisitionRepository.findById(requisitionId);
    if (!existingRequisition) {
      throw new Error('Requisition not found');
    }

    return this.requisitionRepository.update(requisitionId, {
      vehicleId,
      driverId,
    });
  }

  async approveByHOD(requisitionId: number): Promise<Requisition> {
    const existingRequisition = await this.requisitionRepository.findById(requisitionId);
    if (!existingRequisition) {
      throw new Error('Requisition not found');
    }

    if (existingRequisition.status !== 'PENDING') {
      throw new Error('Requisition must be in PENDING status for HOD approval');
    }

    return this.requisitionRepository.update(requisitionId, {
      status: 'HOD_APPROVED',
      hodApprovalDate: new Date(),
    });
  }

  async approveByChairman(requisitionId: number): Promise<Requisition> {
    const existingRequisition = await this.requisitionRepository.findById(requisitionId);
    if (!existingRequisition) {
      throw new Error('Requisition not found');
    }

    if (existingRequisition.status !== 'HOD_APPROVED') {
      throw new Error('Requisition must be in HOD_APPROVED status for Chairman approval');
    }

    return this.requisitionRepository.update(requisitionId, {
      status: 'CHAIRMAN_APPROVED',
      chairmanApprovalDate: new Date(),
    });
  }

  async approveByVC(requisitionId: number): Promise<Requisition> {
    const existingRequisition = await this.requisitionRepository.findById(requisitionId);
    if (!existingRequisition) {
      throw new Error('Requisition not found');
    }

    if (existingRequisition.status !== 'CHAIRMAN_APPROVED') {
      throw new Error('Requisition must be in CHAIRMAN_APPROVED status for VC approval');
    }

    return this.requisitionRepository.update(requisitionId, {
      status: 'VC_APPROVED',
      vcApprovalDate: new Date(),
    });
  }

  async rejectRequisition(
    requisitionId: number,
    rejectionReason: string
  ): Promise<Requisition> {
    const existingRequisition = await this.requisitionRepository.findById(requisitionId);
    if (!existingRequisition) {
      throw new Error('Requisition not found');
    }

    if (existingRequisition.status === 'COMPLETED' || existingRequisition.status === 'REJECTED') {
      throw new Error('Cannot reject a completed or already rejected requisition');
    }

    return this.requisitionRepository.update(requisitionId, {
      status: 'REJECTED',
      rejectionReason,
    });
  }

  async updateRequisitionData(
    requisitionId: number,
    updateData: {
      userId?: number;
      purpose?: string;
      destination?: string;
      dateRequired?: Date;
      returnDate?: Date;
      numberOfPassengers?: number;
      contactNumber?: string;
      notes?: string;
    }
  ): Promise<Requisition> {
    const existingRequisition = await this.requisitionRepository.findById(requisitionId);
    if (!existingRequisition) {
      throw new Error('Requisition not found');
    }

    if (existingRequisition.status !== 'PENDING') {
      throw new Error('Can only update requisition data when in PENDING status');
    }

    // Validate required fields if they are being updated
    if (updateData.dateRequired && updateData.dateRequired < new Date()) {
      throw new Error('Required date cannot be in the past');
    }

    if (updateData.returnDate && updateData.dateRequired && 
        updateData.returnDate < updateData.dateRequired) {
      throw new Error('Return date must be after required date');
    }

    if (updateData.numberOfPassengers && updateData.numberOfPassengers < 1) {
      throw new Error('Number of passengers must be at least 1');
    }

    return this.requisitionRepository.update(requisitionId, updateData);
  }
}