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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let BookingsGateway = class BookingsGateway {
    handleConnection(client) {
        console.log(`[WS] connect: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`[WS] disconnect: ${client.id}`);
    }
    handleJoin(client, data) {
        client.join(`${data.court_id}__${data.date}`);
    }
    handleLeave(client, data) {
        client.leave(`${data.court_id}__${data.date}`);
    }
    emitSlotBooked(courtId, date, startHour) {
        this.server.to(`${courtId}__${date}`).emit('slot_booked', { start_hour: startHour });
    }
    emitSlotCancelled(courtId, date, startHour) {
        this.server.to(`${courtId}__${date}`).emit('slot_cancelled', { start_hour: startHour });
    }
};
exports.BookingsGateway = BookingsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], BookingsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingsGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingsGateway.prototype, "handleLeave", null);
exports.BookingsGateway = BookingsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: '/bookings' })
], BookingsGateway);
//# sourceMappingURL=bookings.gateway.js.map