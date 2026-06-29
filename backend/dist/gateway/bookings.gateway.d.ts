import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, data: {
        court_id: string;
        date: string;
    }): void;
    handleLeave(client: Socket, data: {
        court_id: string;
        date: string;
    }): void;
    emitSlotBooked(courtId: string, date: string, startHour: number): void;
    emitSlotCancelled(courtId: string, date: string, startHour: number): void;
}
