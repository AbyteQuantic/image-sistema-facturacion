import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column() name!: string;
  @Column({ nullable: true }) contactEmail!: string;
  @Column({ nullable: true }) phone!: string;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
