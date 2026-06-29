import { AiService } from './ai.service';
import { CourtsService } from '../courts/courts.service';
declare class ChatDto {
    message: string;
}
declare class SuggestDto {
    requirement: string;
}
declare class ReviewReplyDto {
    comment: string;
    rating: number;
    court_name: string;
}
export declare class AiController {
    private aiService;
    private courtsService;
    constructor(aiService: AiService, courtsService: CourtsService);
    chat(dto: ChatDto): unknown;
    suggest(dto: SuggestDto): unknown;
    reviewReply(dto: ReviewReplyDto): unknown;
}
export {};
