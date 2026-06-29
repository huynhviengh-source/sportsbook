import { Repository } from 'typeorm';
import { Court } from './court.entity';
import { CreateCourtDto, QueryCourtDto } from './dto/court.dto';
export declare class CourtsService {
    private repo;
    constructor(repo: Repository<Court>);
    findAll(query: QueryCourtDto): Promise<Court[]>;
    findOne(id: string): Promise<Court>;
    create(ownerId: string, dto: CreateCourtDto): Promise<Court>;
    update(id: string, ownerId: string, dto: Partial<CreateCourtDto>): Promise<Court>;
    delete(id: string, ownerId: string): Promise<void>;
}
