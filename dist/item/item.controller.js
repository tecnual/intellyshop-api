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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const common_1 = require("@nestjs/common");
const item_service_1 = require("./item.service");
const jwt_auth_guard_1 = require("../core/auth/guards/jwt-auth.guard");
let ItemController = class ItemController {
    constructor(itemService) {
        this.itemService = itemService;
    }
    async setItem(req) {
        return this.itemService.setItem(req.body);
    }
    async getItems(name, barcode) {
        if (barcode)
            return this.itemService.findOneByBarcode(barcode);
        return this.itemService.findAllByName(name);
    }
    async patchItem(req, itemId) {
        return this.itemService.patchItem(itemId, req.body);
    }
    async getItemById(itemId) {
        return this.itemService.findOneById(itemId);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "setItem", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('name')), __param(1, common_1.Query('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "getItems", null);
__decorate([
    common_1.Patch('/:itemId'),
    __param(0, common_1.Req()), __param(1, common_1.Param('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "patchItem", null);
__decorate([
    common_1.Get('/:itemId'),
    __param(0, common_1.Param('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "getItemById", null);
ItemController = __decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('item'),
    __metadata("design:paramtypes", [item_service_1.ItemService])
], ItemController);
exports.ItemController = ItemController;
//# sourceMappingURL=item.controller.js.map