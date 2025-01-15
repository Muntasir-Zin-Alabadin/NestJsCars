import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'sqlite',
            synchronize: this.configService.get<boolean>('SYNCHRO'),
            database: this.configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
        };
    }
}