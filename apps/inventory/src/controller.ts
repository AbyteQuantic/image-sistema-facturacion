import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/entity';
import { ProductService } from './service';
@Controller()
export class ProductController {
  constructor(
    private readonly svc: ProductService,
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}
  @MessagePattern({ cmd: 'inventory.create' }) create(@Payload() dto: any) { return this.svc.create(dto); }
  @MessagePattern({ cmd: 'inventory.findAll' }) findAll() { return this.svc.findAll(); }
  @MessagePattern({ cmd: 'inventory.findOne' }) findOne(@Payload() dto: any) { return this.svc.findOne(dto.id); }
  @MessagePattern({ cmd: 'inventory.update' }) update(@Payload() dto: any) { return this.svc.update(dto.id, dto); }
  @MessagePattern({ cmd: 'inventory.remove' }) remove(@Payload() dto: any) { return this.svc.remove(dto.id); }

  @MessagePattern({ cmd: 'inventory.adjust' })
  async adjust(@Payload() dto: any) {
    const item = await this.repo.findOne({ where: { id: dto.productId } });
    if (!item) throw new Error('No encontramos producto carlosdoño!');
    item.stock = (item.stock || 0) + Number(dto.delta);
    if (item.stock < 0) throw new Error('se acabo el producto carlosdoño!');
    await this.repo.save(item);
    return item;
  }

}
