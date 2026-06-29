"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const user = await this.usersService.create(dto);
        return this.buildResponse(user);
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.password)))
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        return this.buildResponse(user);
    }
    buildResponse(user) {
        const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
        return {
            access_token: token,
            user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map