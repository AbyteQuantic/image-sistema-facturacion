import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/entity';
import { CustomerService } from './service';
import { CustomerController } from './controller';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'mysql', url: process.env.DATABASE_URL, autoLoadEntities: true, synchronize: true }),
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class AppModule {}
