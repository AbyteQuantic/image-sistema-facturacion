import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/entity';
@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}
  create(dto: any) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  async update(id: string, dto: any) {
    const e = await this.findOne(id);
    if (!e) throw new Error('No encontramos producto carlosdoño!');
    Object.assign(e, dto);
    return this.repo.save(e);
  }
  async remove(id: string) {
    const e = await this.findOne(id);
    if (!e) throw new Error('No encontramos producto carlosdoño!');
    await this.repo.remove(e);
    return { id };
  }
}
