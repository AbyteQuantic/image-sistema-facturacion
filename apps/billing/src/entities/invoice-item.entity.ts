import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
@Entity('invoice_item')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() productId!: string;
  @Column('int') quantity!: number;
  @Column('decimal', { precision: 10, scale: 2 }) price!: number;
  @ManyToOne(() => Invoice, (i: Invoice) => i.items, { onDelete: 'CASCADE' })
  invoice!: Invoice;
}
