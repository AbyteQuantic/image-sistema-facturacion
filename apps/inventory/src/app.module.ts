import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/entity';
import { ProductService } from './service';
import { ProductController } from './controller';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'mysql', url: process.env.DATABASE_URL, autoLoadEntities: true, synchronize: process.env.TYPEORM_SYNC === 'true', }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
