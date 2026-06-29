import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): unknown;
    login(dto: LoginDto): unknown;
    private buildResponse;
}
