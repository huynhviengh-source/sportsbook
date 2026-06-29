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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryCourtDto = exports.CreateCourtDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCourtDto {
}
exports.CreateCourtDto = CreateCourtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sân Pickleball Quận 7' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourtDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['pickleball', 'badminton', 'tennis', 'football'] }),
    (0, class_validator_1.IsIn)(['pickleball', 'badminton', 'tennis', 'football']),
    __metadata("design:type", String)
], CreateCourtDto.prototype, "sport_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12 Nguyễn Thị Thập, Q7, HCM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourtDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120000 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(10000),
    __metadata("design:type", Number)
], CreateCourtDto.prototype, "price_per_hour", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourtDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourtDto.prototype, "description", void 0);
class QueryCourtDto {
}
exports.QueryCourtDto = QueryCourtDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['pickleball', 'badminton', 'tennis', 'football'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['pickleball', 'badminton', 'tennis', 'football']),
    __metadata("design:type", String)
], QueryCourtDto.prototype, "sport_type", void 0);
//# sourceMappingURL=court.dto.js.map