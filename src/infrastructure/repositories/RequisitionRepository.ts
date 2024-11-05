import { IRequisitionRepository } from '../../core/interfaces/IRequisitionRepository';
import { Requisition } from '../../core/domain/Requisition';
import pool from '../database/connection';

export class RequisitionRepository implements IRequisitionRepository {
  async create(requisition: Requisition): Promise<Requisition> {
    const {
      userId,
      purpose,
      destination,
      dateRequired,
      returnDate,
      numberOfPassengers,
      contactNumber,
      vehicleId,
      driverId,
    } = requisition;

    const { rows } = await pool.query(
      `INSERT INTO requisitions (
        user_id, purpose, destination, date_required, return_date, number_of_passengers, contact_number, vehicle_id, driver_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        userId,
        purpose,
        destination,
        dateRequired,
        returnDate,
        numberOfPassengers,
        contactNumber,
        vehicleId,
        driverId,
      ]
    );
    return rows[0];
  }

  async findById(id: number): Promise<Requisition | null> {
    const { rows } = await pool.query('SELECT * FROM requisitions WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findByUserId(userId: number): Promise<Requisition[]> {
    const { rows } = await pool.query('SELECT * FROM requisitions WHERE user_id = $1', [userId]);
    return rows;
  }

  async update(id: number, requisition: Partial<Requisition>): Promise<Requisition> {
    const {
      userId,
      purpose,
      destination,
      dateRequired,
      returnDate,
      numberOfPassengers,
      contactNumber,
      vehicleId,
      driverId,
      status,
      hodApprovalDate,
      chairmanApprovalDate,
      vcApprovalDate,
      rejectionReason,
      notes,
    } = requisition;

    const { rows } = await pool.query(
      `UPDATE requisitions
       SET user_id = COALESCE($1, user_id),
           purpose = COALESCE($2, purpose),
           destination = COALESCE($3, destination),
           date_required = COALESCE($4, date_required),
           return_date = COALESCE($5, return_date),
           number_of_passengers = COALESCE($6, number_of_passengers),
           contact_number = COALESCE($7, contact_number),
           vehicle_id = COALESCE($8, vehicle_id),
           driver_id = COALESCE($9, driver_id),
           status = COALESCE($10, status),
           hod_approval_date = COALESCE($11, hod_approval_date),
           chairman_approval_date = COALESCE($12, chairman_approval_date),
           vc_approval_date = COALESCE($13, vc_approval_date),
           rejection_reason = COALESCE($14, rejection_reason),
           notes = COALESCE($15, notes)
       WHERE id = $16
       RETURNING *`,
      [
        userId,
        purpose,
        destination,
        dateRequired,
        returnDate,
        numberOfPassengers,
        contactNumber,
        vehicleId,
        driverId,
        status,
        hodApprovalDate,
        chairmanApprovalDate,
        vcApprovalDate,
        rejectionReason,
        notes,
        id,
      ]
    );
    return rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM requisitions WHERE id = $1', [id]);
    return rowCount != null && rowCount > 0;
  }

  async search(
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
    
    let query = 'SELECT * FROM requisitions WHERE 1 = 1';
    const params: any[] = [];
    let paramIndex = 1; // Start with the first parameter index

    if (userId !== undefined) {
        query += ` AND user_id = $${paramIndex++}`; // Increment paramIndex after use
        params.push(userId);
    }
    if (purpose) {
        query += ` AND purpose LIKE $${paramIndex++}`;
        params.push(`%${purpose}%`);
    }
    if (destination) {
        query += ` AND destination LIKE $${paramIndex++}`;
        params.push(`%${destination}%`);
    }
    if (dateRequired) {
        if (dateRequired.from) {
            query += ` AND date_required >= $${paramIndex++}`;
            params.push(dateRequired.from);
        }
        if (dateRequired.to) {
            query += ` AND date_required <= $${paramIndex++}`;
            params.push(dateRequired.to);
        }
    }
    if (returnDate) {
        if (returnDate.from) {
            query += ` AND return_date >= $${paramIndex++}`;
            params.push(returnDate.from);
        }
        if (returnDate.to) {
            query += ` AND return_date <= $${paramIndex++}`;
            params.push(returnDate.to);
        }
    }
    if (numberOfPassengers) {
        if (numberOfPassengers.from) {
            query += ` AND number_of_passengers >= $${paramIndex++}`;
            params.push(numberOfPassengers.from);
        }
        if (numberOfPassengers.to) {
            query += ` AND number_of_passengers <= $${paramIndex++}`;
            params.push(numberOfPassengers.to);
        }
    }
    if (status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    if (contactNumber) {
        query += ` AND contact_number LIKE $${paramIndex++}`;
        params.push(`%${contactNumber}%`);
    }
    if (vehicleId !== undefined) {
        query += ` AND vehicle_id = $${paramIndex++}`;
        params.push(vehicleId);
    }
    if (driverId !== undefined) {
        query += ` AND driver_id = $${paramIndex++}`;
        params.push(driverId);
    }

    if (sort) {
        query += ` ORDER BY ${sort.field} ${sort.direction}`;
    }

    if (page !== undefined && limit !== undefined) {
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit);
        params.push((page - 1) * limit);
    }

    // console.log(query);
    // console.log(params);
    const { rows } = await pool.query(query, params);
    const totalCount = (await pool.query('SELECT COUNT(*) FROM requisitions')).rows[0].count;

    return { requisitions: rows, totalCount: parseInt(totalCount, 10) };
  }
}