import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';
@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() customerId!: string;
  @Column() createdByUserId!: string;
  @OneToMany(() => InvoiceItem, (i: InvoiceItem) => i.invoice, { cascade: true, eager: true })
  items!: InvoiceItem[];
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
