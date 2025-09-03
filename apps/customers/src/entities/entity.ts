import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column() name!: string;
  @Column({ unique: true, nullable: true }) email!: string;
  @Column({ nullable: true }) phone!: string;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
