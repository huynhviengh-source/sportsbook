export declare class AiService {
    chat(userMessage: string, courts: any[]): Promise<string>;
    suggestCourts(requirement: string, courts: any[]): Promise<any[]>;
    generateReviewReply(reviewComment: string, rating: number, courtName: string): Promise<string>;
}
