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
exports.ItemSchema = exports.Item = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const list_schema_1 = require("../list/list.schema");
let Item = class Item {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Item.prototype, "barcode", void 0);
__decorate([
    mongoose_1.Prop({ type: Object }),
    __metadata("design:type", Object)
], Item.prototype, "openFoodFactsProduct", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Item.prototype, "public", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", list_schema_1.ListUser)
], Item.prototype, "createdBy", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], Item.prototype, "updatedBy", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
Item = __decorate([
    mongoose_1.Schema({
        timestamps: { createdAt: true, updatedAt: true }
    })
], Item);
exports.Item = Item;
exports.ItemSchema = mongoose_1.SchemaFactory.createForClass(Item);
//# sourceMappingURL=item.schema.js.map