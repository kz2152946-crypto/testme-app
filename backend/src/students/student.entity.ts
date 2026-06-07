import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TestResult } from '../test-results/test-result.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  group!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @OneToMany(() => TestResult, result => result.student)
  results!: TestResult[];
}

