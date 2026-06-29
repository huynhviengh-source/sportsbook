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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const courts_service_1 = require("../courts/courts.service");
const bookings_gateway_1 = require("../gateway/bookings.gateway");
let BookingsService = class BookingsService {
    constructor(repo, courtsService, gateway) {
        this.repo = repo;
        this.courtsService = courtsService;
        this.gateway = gateway;
    }
    async getBookedSlots(courtId, date) {
        const rows = await this.repo.find({
            where: { court_id: courtId, booking_date: date, status: 'confirmed' },
            select: ['start_hour'],
        });
        return rows.map(r => r.start_hour);
    }
    async create(userId, dto) {
        const court = await this.courtsService.findOne(dto.court_id);
        const today = new Date().toISOString().split('T')[0];
        if (dto.booking_date < today)
            throw new common_1.BadRequestException('Không thể đặt sân trong quá khứ');
        const dup = await this.repo.findOne({
            where: { court_id: dto.court_id, booking_date: dto.booking_date, start_hour: dto.start_hour, status: 'confirmed' },
        });
        if (dup)
            throw new common_1.ConflictException('Giờ này đã có người đặt rồi');
        const booking = await this.repo.save(this.repo.create({
            ...dto,
            user_id: userId,
            end_hour: dto.start_hour + 1,
            total_price: court.price_per_hour,
            status: 'confirmed',
        }));
        this.gateway.emitSlotBooked(dto.court_id, dto.booking_date, dto.start_hour);
        return booking;
    }
    async getMyBookings(userId) {
        return this.repo.find({
            where: { user_id: userId },
            relations: ['court'],
            order: { booking_date: 'DESC', start_hour: 'ASC' },
        });
    }
    async cancel(bookingId, userId) {
        const b = await this.repo.findOne({ where: { id: bookingId } });
        if (!b)
            throw new common_1.NotFoundException('Không tìm thấy lịch đặt');
        if (b.user_id !== userId)
            throw new common_1.ForbiddenException('Không có quyền huỷ');
        if (b.status === 'cancelled')
            throw new common_1.BadRequestException('Đã huỷ rồi');
        b.status = 'cancelled';
        const saved = await this.repo.save(b);
        this.gateway.emitSlotCancelled(b.court_id, b.booking_date, b.start_hour);
        return saved;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, courts_service_1.CourtsService,
        bookings_gateway_1.BookingsGateway])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map