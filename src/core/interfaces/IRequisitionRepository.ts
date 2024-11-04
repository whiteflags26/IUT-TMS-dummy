import { Requisition } from '../domain/Requisition';

export interface IRequisitionRepository {
  create(requisition: Requisition): Promise<Requisition>;
  findById(id: number): Promise<Requisition | null>;
  findByUserId(userId: number): Promise<Requisition[]>;
  update(id: number, requisition: Partial<Requisition>): Promise<Requisition>;
  delete(id: number): Promise<boolean>;
}