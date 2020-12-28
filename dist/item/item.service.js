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
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const item_schema_1 = require("./item.schema");
let ItemService = class ItemService {
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    async setItem(item) {
        if (!item._id)
            item._id = new mongoose_2.Types.ObjectId();
        return this.itemModel.findByIdAndUpdate(item._id, item, { upsert: true, new: true });
    }
    async findOneById(itemId) {
        return this.itemModel.findById(itemId).exec();
    }
    async findAllByName(filter) {
        const query = filter || filter === '' ? { name: { "$regex": filter, "$options": "i" } } : null;
        return this.itemModel.find(query).exec();
    }
    async findOneByBarcode(barcode) {
        return this.itemModel.findOne({ barcode }).exec();
    }
    async patchItem(itemId, item) {
        return this.itemModel.updateOne({ _id: itemId }, { $set: { price: item.price, name: item.name } });
    }
};
ItemService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(item_schema_1.Item.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ItemService);
exports.ItemService = ItemService;
//# sourceMappingURL=item.service.js.map