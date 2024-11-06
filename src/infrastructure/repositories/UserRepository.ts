import { IUserRepository } from '../../core/interfaces/IUserRepository';
import { User } from '../../core/domain/User';
import pool from '../database/connection';

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.username, user.email, user.password, user.role, user.department]
    );
    return rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const { rows } = await pool.query(
      'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), role = COALESCE($3, role), department = COALESCE($4, department) WHERE id = $5 RETURNING *',
      [user.username, user.email, user.role, user.department, id]
    );
    return rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount != null && rowCount > 0;
    //return rowCount > 0;
  }

  async findAll(): Promise<Partial<User>[]> {
    const { rows } = await pool.query(
      `SELECT 
        id, 
        username, 
        email, 
        role, 
        department, 
        contact_number, 
        created_at, 
        updated_at 
      FROM users
      ORDER BY created_at DESC`
    );
    return rows;
  }
}
