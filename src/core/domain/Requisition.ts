export interface Requisition {
  id?: number;
  userId: number;
  purpose: string;
  destination: string;
  dateRequired: Date;
  numberOfPassengers: number;
  status: 'PENDING' | 'HOD_APPROVED' | 'CHAIRMAN_APPROVED' | 'VC_APPROVED' | 'REJECTED' | 'COMPLETED';
  contactNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}
