import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/entity';
@Injectable()
export class SupplierService {
  constructor(@InjectRepository(Supplier) private readonly repo: Repository<Supplier>) {}
  create(dto: any) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  async update(id: string, dto: any) {
    const e = await this.findOne(id);
    if (!e) throw new Error('no encontramos proveedor carlosdoño!');
    Object.assign(e, dto);
    return this.repo.save(e);
  }
  async remove(id: string) {
    const e = await this.findOne(id);
    if (!e) throw new Error('no encontramos proveedor carlosdoño!');
    await this.repo.remove(e);
    return { id };
  }
}
