export interface Requisition {
  id?: number;
  userId: number;
  purpose: string;
  destination: string;
  dateRequired: Date;
  returnDate?: Date;
  numberOfPassengers: number;
  status: 'PENDING' | 'HOD_APPROVED' | 'CHAIRMAN_APPROVED' | 'VC_APPROVED' | 'REJECTED' | 'COMPLETED';
  contactNumber: string;
  vehicleId?: number;
  driverId?: number;
  hodApprovalDate?: Date;
  chairmanApprovalDate?: Date;
  vcApprovalDate?: Date;
  rejectionReason?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}