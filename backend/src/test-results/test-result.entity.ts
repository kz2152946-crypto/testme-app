import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../students/student.entity';
import { Test } from '../tests/test.entity';

@Entity()
export class TestResult {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score!: number;

  @Column()
  maxScore!: number;

  @CreateDateColumn()
  completedAt!: Date;

  @ManyToOne(() => Student, student => student.results)
  student!: Student;

  @ManyToOne(() => Test, test => test.results)
  test!: Test;
}

