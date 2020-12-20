"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoProviderModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
let MongoProviderModule = class MongoProviderModule {
};
MongoProviderModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    let dbUrl;
                    if (configService.get('database.schema') === 'mongodb+srv') {
                        dbUrl = configService.get('database.schema') +
                            '://' +
                            configService.get('database.user') +
                            ':' +
                            configService.get('database.password') +
                            '@' +
                            configService.get('database.host') +
                            '/' +
                            configService.get('database.dbName') +
                            '?' +
                            configService.get('database.options');
                    }
                    else {
                        dbUrl = configService.get('database.schema') +
                            '://' +
                            configService.get('database.user') +
                            ':' +
                            configService.get('database.password') +
                            '@' +
                            configService.get('database.host') +
                            ':' +
                            configService.get('database.port') +
                            '/' +
                            configService.get('database.dbName') +
                            '?' +
                            configService.get('database.options');
                    }
                    console.log('dbUrl: ', dbUrl, process.env.WS_DB_HOST);
                    return ({
                        useCreateIndex: true,
                        autoIndex: true,
                        useFindAndModify: false,
                        useNewUrlParser: true,
                        uri: dbUrl
                    });
                },
                inject: [config_1.ConfigService],
            })
        ],
    })
], MongoProviderModule);
exports.MongoProviderModule = MongoProviderModule;
//# sourceMappingURL=provider.module.js.map