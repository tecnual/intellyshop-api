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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseSchema = exports.Purchase = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const list_schema_1 = require("../list/list.schema");
let Purchase = class Purchase {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", list_schema_1.ListUser)
], Purchase.prototype, "user", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: 'List' }),
    __metadata("design:type", Object)
], Purchase.prototype, "list", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Purchase.prototype, "totalPrice", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Purchase.prototype, "totalQuantity", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], Purchase.prototype, "listItems", void 0);
Purchase = __decorate([
    mongoose_1.Schema({
        timestamps: { createdAt: true, updatedAt: true }
    })
], Purchase);
exports.Purchase = Purchase;
exports.PurchaseSchema = mongoose_1.SchemaFactory.createForClass(Purchase);
//# sourceMappingURL=purchase.schema.js.map