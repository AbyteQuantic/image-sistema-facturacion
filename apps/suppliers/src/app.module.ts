import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/entity';
import { SupplierService } from './service';
import { SupplierController } from './controller';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'mysql', url: process.env.DATABASE_URL, autoLoadEntities: true, synchronize: true }),
    TypeOrmModule.forFeature([Supplier]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class AppModule {}
