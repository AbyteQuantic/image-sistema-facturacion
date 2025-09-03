import { Module } from '@nestjs/common';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { HealthController } from './controllers/health.controller';
import { AuthController } from './controllers/auth.controller';
import { InventoryController } from './controllers/inventory.controller';
import { SuppliersController } from './controllers/suppliers.controller';
import { CustomersController } from './controllers/customers.controller';
import { BillingController } from './controllers/billing.controller';
@Module({
  imports: [],
  controllers: [HealthController, AuthController, InventoryController, SuppliersController, CustomersController, BillingController],
  providers: [JwtStrategy, { provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
