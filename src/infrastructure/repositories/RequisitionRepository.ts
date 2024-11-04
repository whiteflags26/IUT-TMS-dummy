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
}