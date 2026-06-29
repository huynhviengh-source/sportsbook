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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const courts_service_1 = require("../courts/courts.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
class ChatDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Tôi muốn tìm sân pickleball gần Quận 7' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatDto.prototype, "message", void 0);
class SuggestDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Muốn chơi cầu lông buổi sáng, giá rẻ' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SuggestDto.prototype, "requirement", void 0);
class ReviewReplyDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Sân rất đẹp, nhân viên nhiệt tình' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReviewReplyDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ReviewReplyDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Sân Pickleball Quận 7' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReviewReplyDto.prototype, "court_name", void 0);
let AiController = class AiController {
    constructor(aiService, courtsService) {
        this.aiService = aiService;
        this.courtsService = courtsService;
    }
    async chat(dto) {
        const courts = await this.courtsService.findAll({});
        const reply = await this.aiService.chat(dto.message, courts);
        return { reply };
    }
    async suggest(dto) {
        const courts = await this.courtsService.findAll({});
        const suggested = await this.aiService.suggestCourts(dto.requirement, courts);
        return { courts: suggested };
    }
    async reviewReply(dto) {
        const reply = await this.aiService.generateReviewReply(dto.comment, dto.rating, dto.court_name);
        return { reply };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, swagger_1.ApiOperation)({ summary: 'Chatbot hỗ trợ khách hàng' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('suggest'),
    (0, swagger_1.ApiOperation)({ summary: 'Gợi ý sân thông minh theo yêu cầu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SuggestDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "suggest", null);
__decorate([
    (0, common_1.Post)('review-reply'),
    (0, swagger_1.ApiOperation)({ summary: 'AI generate câu trả lời review' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReviewReplyDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "reviewReply", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('🤖 AI'),
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        courts_service_1.CourtsService])
], AiController);
//# sourceMappingURL=ai.controller.js.map