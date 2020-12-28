"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const status_controller_1 = require("./status/status.controller");
const user_module_1 = require("./user/user.module");
const user_controller_1 = require("./user/user.controller");
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    common_1.Module({
        controllers: [status_controller_1.StatusController, user_controller_1.UserController],
        imports: [user_module_1.UserModule, auth_module_1.AuthModule],
        exports: [user_module_1.UserModule, auth_module_1.AuthModule]
    })
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map