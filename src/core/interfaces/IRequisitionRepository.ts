import { Requisition } from '../domain/Requisition';

export interface IRequisitionRepository {
  create(requisition: Requisition): Promise<Requisition>;
  findById(id: number): Promise<Requisition | null>;
  findByUserId(userId: number): Promise<Requisition[]>;
  update(id: number, requisition: Partial<Requisition>): Promise<Requisition>;
  delete(id: number): Promise<boolean>;
  search(
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
  ): Promise<{ requisitions: Requisition[]; totalCount: number }>;
}