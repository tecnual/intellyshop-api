import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const TwitterAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TwitterAuthGuard extends TwitterAuthGuard_base {
    private readonly reflector;
    private roles;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(err: any, user: any, info: any): any;
    private hasRole;
}
export {};
