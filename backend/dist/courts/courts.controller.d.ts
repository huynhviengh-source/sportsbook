import { CourtsService } from './courts.service';
import { CreateCourtDto, QueryCourtDto } from './dto/court.dto';
export declare class CourtsController {
    private svc;
    constructor(svc: CourtsService);
    findAll(q: QueryCourtDto): Promise<{}>;
    findOne(id: string): Promise<import("./court.entity").Court>;
    create(u: any, dto: CreateCourtDto): Promise<import("./court.entity").Court>;
    update(id: string, u: any, dto: Partial<CreateCourtDto>): Promise<import("./court.entity").Court>;
    remove(id: string, u: any): Promise<void>;
}
