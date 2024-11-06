import { IUserRepository} from '../../core/interfaces/IUserRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { User } from '../../core/domain/User';

export class UserService {
    private userRepository: IUserRepository;
  
    constructor() {
      this.userRepository = new UserRepository();
    }
  
    async createUser(user: User): Promise<User> {
      return this.userRepository.create(user);
    }
  
    async getUserById(id: number): Promise<User | null> {
      return this.userRepository.findById(id);
    }
  
    async getUserByEmail(email: string): Promise<User | null> {
      return this.userRepository.findByEmail(email);
    }
  
    async getAllUsers(): Promise<Partial<User>[]> {
      return this.userRepository.findAll();
    }
  
    async updateUser(id: number, user: Partial<User>): Promise<User> {
      return this.userRepository.update(id, user);
    }
  
    async deleteUser(id: number): Promise<boolean> {
      return this.userRepository.delete(id);
    }
  }