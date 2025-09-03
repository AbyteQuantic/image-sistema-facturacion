import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice) private readonly invRepo: Repository<Invoice>,
    @Inject('INVENTORY') private readonly inventoryClient: ClientProxy,
  ) {}
  async findAll() { return this.invRepo.find(); }
  async create(dto: any) {
    const invoice = new Invoice();
    invoice.customerId = dto.customerId;
    invoice.createdByUserId = dto.userId;
    invoice.items = (dto.items || []).map((it:any) => {
      const item = new InvoiceItem();
      item.productId = it.productId;
      item.quantity = Number(it.quantity);
      item.price = Number(it.price);
      return item;
    });
    const saved = await this.invRepo.save(invoice);
    for (const it of saved.items) {
      await firstValueFrom(this.inventoryClient.send({ cmd: 'inventory.adjust' }, { productId: it.productId, delta: -it.quantity }).pipe(timeout(10000)));
    }
    return saved;
  }
  async returnItem(dto: any) {
    const inv = await this.invRepo.findOne({ where: { id: dto.invoiceId } });
    if (!inv) throw new Error('Invoice not found');
    await firstValueFrom(this.inventoryClient.send({ cmd: 'inventory.adjust' }, { productId: dto.productId, delta: Number(dto.quantity) }).pipe(timeout(10000)));
    return { ok: true };
  }
}
