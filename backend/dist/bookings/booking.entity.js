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
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const court_entity_1 = require("../courts/court.entity");
const user_entity_1 = require("../users/user.entity");
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "court_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => court_entity_1.Court),
    (0, typeorm_1.JoinColumn)({ name: 'court_id' }),
    __metadata("design:type", court_entity_1.Court)
], Booking.prototype, "court", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Booking.prototype, "booking_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "start_hour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "end_hour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "total_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'confirmed' }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Booking.prototype, "created_at", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings'),
    (0, typeorm_1.Unique)(['court_id', 'booking_date', 'start_hour'])
], Booking);
//# sourceMappingURL=booking.entity.js.map