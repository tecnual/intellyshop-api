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
exports.ListService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const user_schema_1 = require("../core/user/user.schema");
const list_schema_1 = require("./list.schema");
let ListService = class ListService {
    constructor(listModel) {
        this.listModel = listModel;
    }
    async upsert(addListDto, user) {
        addListDto.owner = user;
        const addedList = new this.listModel(addListDto);
        return this.listModel.findOneAndUpdate({ _id: addedList._id }, addedList, { new: true, upsert: true }).exec();
    }
    async getUserLists(user) {
        return this.listModel.find({ $or: [{ "owner._id": user._id }, { 'sharedUsers._id': user._id }] }).exec();
    }
    addItemToList(listId, listItem) {
        listItem._id = new mongoose_2.Types.ObjectId();
        return rxjs_1.from(this.listModel.updateOne({ _id: listId }, { $push: { listItems: { $each: [listItem], $position: 0 } } }));
    }
    addItemToListCart(listId, cartItem) {
        cartItem._id = new mongoose_2.Types.ObjectId();
        return rxjs_1.from(this.listModel.updateOne({ _id: listId }, { $push: { cartItems: { $each: [cartItem], $position: 0 } } }));
    }
    async removeItemFromList(listId, listItemId) {
        return this.listModel.updateOne({ _id: listId }, { $pull: { listItems: { _id: new mongoose_2.Types.ObjectId(listItemId) } } });
    }
    removeItemFromListCart(listId, cartItemId) {
        return this.listModel.updateOne({ _id: listId }, { $pull: { cartItems: { _id: new mongoose_2.Types.ObjectId(cartItemId) } } });
    }
    async updateItemFromList(listId, listItemId, listItem, type) {
        const setUpdate = {};
        listItem.name ? setUpdate[type + 'Items.$.name'] = listItem.name : null;
        listItem.itemId ? setUpdate[type + 'Items.$.itemId'] = listItem.itemId : null;
        listItem.quantity ? setUpdate[type + 'Items.$.quantity'] = Number(listItem.quantity) : null;
        listItem.price ? setUpdate[type + 'Items.$.price'] = Number(listItem.price) : null;
        const query = { _id: listId };
        query[`${type}Items._id`] = new mongoose_2.Types.ObjectId(listItemId);
        return this.listModel.updateOne(query, { $set: setUpdate });
    }
    async removeListItems(listId) {
        return this.listModel.updateOne({ _id: listId }, { $set: { listItems: [] } });
    }
    async removeCartItems(listId) {
        return this.listModel.updateOne({ _id: listId }, { $set: { cartItems: [] } });
    }
    async deleteList(listId) {
        return this.listModel.deleteOne({ _id: listId });
    }
    addSharedUser(listId, user) {
        return rxjs_1.from(this.listModel.updateOne({ _id: listId }, { $push: { sharedUsers: { $each: [user], $position: 0 } } }));
    }
};
ListService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(list_schema_1.List.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ListService);
exports.ListService = ListService;
//# sourceMappingURL=list.service.js.map