import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/entity';
import { CustomerService } from './service';
@Controller()
export class CustomerController {
  constructor(
    private readonly svc: CustomerService,
    @InjectRepository(Customer) private readonly repo: Repository<Customer>,
  ) {}
  @MessagePattern({ cmd: 'customers.create' }) create(@Payload() dto: any) { return this.svc.create(dto); }
  @MessagePattern({ cmd: 'customers.findAll' }) findAll() { return this.svc.findAll(); }
  @MessagePattern({ cmd: 'customers.findOne' }) findOne(@Payload() dto: any) { return this.svc.findOne(dto.id); }
  @MessagePattern({ cmd: 'customers.update' }) update(@Payload() dto: any) { return this.svc.update(dto.id, dto); }
  @MessagePattern({ cmd: 'customers.remove' }) remove(@Payload() dto: any) { return this.svc.remove(dto.id); }

}
