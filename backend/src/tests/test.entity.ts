import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from '../questions/question.entity';
import { TestResult } from '../test-results/test-result.entity';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  subject!: string;

  @Column({ default: 'quiz' })
  type!: string; 

  @OneToMany(() => Question, question => question.test)
  questions!: Question[];

  @OneToMany(() => TestResult, result => result.test)
  results!: TestResult[];
}

