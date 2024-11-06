import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService';
import { User } from '../../core/domain/User';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.updateUser(Number(req.params.id), req.body);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.userService.deleteUser(Number(req.params.id));
      if (!success) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}