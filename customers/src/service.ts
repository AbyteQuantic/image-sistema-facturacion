import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/entity';
@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private readonly repo: Repository<Customer>) {}
  create(dto: any) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  async update(id: string, dto: any) {
    const e = await this.findOne(id);
    if (!e) throw new Error('No encontramos cliente carlosdoño!');
    Object.assign(e, dto);
    return this.repo.save(e);
  }
  async remove(id: string) {
    const e = await this.findOne(id);
    if (!e) throw new Error('No encontramos cliente carlosdoño!');
    await this.repo.remove(e);
    return { id };
  }
}
