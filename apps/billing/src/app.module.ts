import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'mysql', url: process.env.DATABASE_URL, autoLoadEntities: true, synchronize: process.env.TYPEORM_SYNC === 'true', }),
    TypeOrmModule.forFeature([Invoice, InvoiceItem]),
    ClientsModule.register([
      { name: 'INVENTORY', transport: Transport.TCP, options: { host: process.env.INVENTORY_HOST, port: Number(process.env.INVENTORY_PORT) } },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class AppModule {}
