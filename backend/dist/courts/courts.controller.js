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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const courts_service_1 = require("./courts.service");
const court_dto_1 = require("./dto/court.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let CourtsController = class CourtsController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) { return this.svc.findAll(q); }
    findOne(id) { return this.svc.findOne(id); }
    create(u, dto) {
        return this.svc.create(u.id, dto);
    }
    update(id, u, dto) {
        return this.svc.update(id, u.id, dto);
    }
    remove(id, u) {
        return this.svc.delete(id, u.id);
    }
};
exports.CourtsController = CourtsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách sân' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [court_dto_1.QueryCourtDto]),
    __metadata("design:returntype", void 0)
], CourtsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết sân' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourtsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo sân mới' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, court_dto_1.CreateCourtDto]),
    __metadata("design:returntype", void 0)
], CourtsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật sân' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_a = typeof Partial !== "undefined" && Partial) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], CourtsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xoá sân' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CourtsController.prototype, "remove", null);
exports.CourtsController = CourtsController = __decorate([
    (0, swagger_1.ApiTags)('Courts'),
    (0, common_1.Controller)('courts'),
    __metadata("design:paramtypes", [courts_service_1.CourtsService])
], CourtsController);
//# sourceMappingURL=courts.controller.js.map