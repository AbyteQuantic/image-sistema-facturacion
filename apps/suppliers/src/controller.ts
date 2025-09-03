import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/entity';
import { SupplierService } from './service';
@Controller()
export class SupplierController {
  constructor(
    private readonly svc: SupplierService,
    @InjectRepository(Supplier) private readonly repo: Repository<Supplier>,
  ) {}
  @MessagePattern({ cmd: 'suppliers.create' }) create(@Payload() dto: any) { return this.svc.create(dto); }
  @MessagePattern({ cmd: 'suppliers.findAll' }) findAll() { return this.svc.findAll(); }
  @MessagePattern({ cmd: 'suppliers.findOne' }) findOne(@Payload() dto: any) { return this.svc.findOne(dto.id); }
  @MessagePattern({ cmd: 'suppliers.update' }) update(@Payload() dto: any) { return this.svc.update(dto.id, dto); }
  @MessagePattern({ cmd: 'suppliers.remove' }) remove(@Payload() dto: any) { return this.svc.remove(dto.id); }

}
