import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Test } from '../tests/test.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column({ nullable: true })
  optionA!: string;

  @Column({ nullable: true })
  optionB!: string;

  @Column({ nullable: true })
  optionC!: string;

  @Column({ nullable: true })
  optionD!: string;

  @Column({ nullable: true })
  typeA!: string;

  @Column({ nullable: true })
  typeB!: string;

  @Column({ nullable: true })
  typeC!: string;

  @Column({ nullable: true })
  typeD!: string;

  @Column()
  correctAnswer!: string;

  @ManyToOne(() => Test, test => test.questions)
  test!: Test;
}

