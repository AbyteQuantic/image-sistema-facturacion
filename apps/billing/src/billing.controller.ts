import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BillingService } from './billing.service';
@Controller()
export class BillingController {
  constructor(private readonly svc: BillingService) {}
  @MessagePattern({ cmd: 'billing.findAll' }) findAll() { return this.svc.findAll(); }
  @MessagePattern({ cmd: 'billing.create' }) create(@Payload() dto: any) { return this.svc.create(dto); }
  @MessagePattern({ cmd: 'billing.return' }) returnItem(@Payload() dto: any) { return this.svc.returnItem(dto); }
}
