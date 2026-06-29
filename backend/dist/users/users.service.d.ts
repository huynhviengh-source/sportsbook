import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    create(data: {
        email: string;
        password: string;
        full_name: string;
    }): Promise<User>;
    findByEmail(email: string): any;
    findById(id: string): any;
}
