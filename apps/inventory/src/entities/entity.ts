import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column() name!: string;
  @Column({ unique: true }) sku!: string;
  @Column('decimal', { precision: 10, scale: 2 }) price!: number;
  @Column({ type: 'int', default: 0 }) stock!: number;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
