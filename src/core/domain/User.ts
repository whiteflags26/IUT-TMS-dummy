export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: 'FACULTY' | 'HOD' | 'CHAIRMAN' | 'VC' | 'TRANSPORT_OFFICER' | 'DRIVER' | 'ADMIN';
  department?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
