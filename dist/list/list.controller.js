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
exports.ListController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../core/auth/guards/jwt-auth.guard");
const add_list_dto_1 = require("./dto/add-list.dto");
const list_service_1 = require("./list.service");
let ListController = class ListController {
    constructor(listService) {
        this.listService = listService;
    }
    async upsertList(req, body) {
        return this.listService.upsert(body, req.user);
    }
    async getUserLists(req) {
        return this.listService.getUserLists(req.user);
    }
    addItemToList(listId, req) {
        return this.listService.addItemToList(listId, req.body);
    }
    addItemToListCart(listId, req) {
        return this.listService.addItemToListCart(listId, req.body);
    }
    removeItemFromList(listId, listItemId) {
        return this.listService.removeItemFromList(listId, listItemId);
    }
    removeListItems(listId) {
        return this.listService.removeListItems(listId);
    }
    removeCartItems(listId) {
        return this.listService.removeCartItems(listId);
    }
    removeItemFromCartList(listId, cartItemId) {
        return this.listService.removeItemFromListCart(listId, cartItemId);
    }
    updateListItem(listId, listItemId, body) {
        return this.listService.updateItemFromList(listId, listItemId, body, 'list');
    }
    updateCartItem(listId, listItemId, body) {
        return this.listService.updateItemFromList(listId, listItemId, body, 'cart');
    }
    deleteList(listId) {
        return this.listService.deleteList(listId);
    }
    addSharedUser(listId, user) {
        return this.listService.addSharedUser(listId, user);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_list_dto_1.AddListDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "upsertList", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "getUserLists", null);
__decorate([
    common_1.Patch('/:listId/item/'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], ListController.prototype, "addItemToList", null);
__decorate([
    common_1.Patch('/:listId/cart/item/'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], ListController.prototype, "addItemToListCart", null);
__decorate([
    common_1.Delete('/:listId/item/:listItemId'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Param('listItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "removeItemFromList", null);
__decorate([
    common_1.Delete('/:listId/list'),
    __param(0, common_1.Param('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "removeListItems", null);
__decorate([
    common_1.Delete('/:listId/cart'),
    __param(0, common_1.Param('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "removeCartItems", null);
__decorate([
    common_1.Delete('/:listId/cart/item/:cartItemId'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Param('cartItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "removeItemFromCartList", null);
__decorate([
    common_1.Put('/:listId/list/item/:listItemId'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Param('listItemId')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "updateListItem", null);
__decorate([
    common_1.Put('/:listId/cart/item/:listItemId'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Param('listItemId')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "updateCartItem", null);
__decorate([
    common_1.Delete('/:listId'),
    __param(0, common_1.Param('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "deleteList", null);
__decorate([
    common_1.Put('/:listId/share-user'),
    __param(0, common_1.Param('listId')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], ListController.prototype, "addSharedUser", null);
ListController = __decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('list'),
    __metadata("design:paramtypes", [list_service_1.ListService])
], ListController);
exports.ListController = ListController;
//# sourceMappingURL=list.controller.js.map