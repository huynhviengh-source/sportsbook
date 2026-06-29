import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(cfg: ConfigService);
    validate(payload: any): {
        id: any;
        email: any;
        role: any;
    };
}
export {};
