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
exports.ListSchema = exports.ListItem = exports.List = exports.ListUser = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ListUser = class ListUser {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ListUser.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ListUser.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], ListUser.prototype, "_id", void 0);
ListUser = __decorate([
    mongoose_1.Schema()
], ListUser);
exports.ListUser = ListUser;
let List = class List {
};
__decorate([
    mongoose_1.Prop({ unique: true }),
    __metadata("design:type", String)
], List.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], List.prototype, "description", void 0);
__decorate([
    mongoose_1.Prop({ type: ListUser }),
    __metadata("design:type", Object)
], List.prototype, "owner", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Store' }),
    __metadata("design:type", Object)
], List.prototype, "store", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], List.prototype, "listItems", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], List.prototype, "cartItems", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], List.prototype, "sharedUsers", void 0);
List = __decorate([
    mongoose_1.Schema({
        timestamps: { createdAt: true, updatedAt: true }
    })
], List);
exports.List = List;
let ListItem = class ListItem {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ListItem.prototype, "_id", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], ListItem.prototype, "quantity", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], ListItem.prototype, "price", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ListItem.prototype, "currency", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ListItem.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Item' }),
    __metadata("design:type", Object)
], ListItem.prototype, "itemId", void 0);
ListItem = __decorate([
    mongoose_1.Schema({
        timestamps: { createdAt: true, updatedAt: true }
    })
], ListItem);
exports.ListItem = ListItem;
exports.ListSchema = mongoose_1.SchemaFactory.createForClass(List);
//# sourceMappingURL=list.schema.js.map