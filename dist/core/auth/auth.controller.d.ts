import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginLocal(req: any): Promise<{
        token: string;
        user: any;
    }>;
    getProfile(req: any): any;
}
