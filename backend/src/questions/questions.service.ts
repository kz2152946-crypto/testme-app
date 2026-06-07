import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(Question) private repo: Repository<Question>) {}

  findAll() { return this.repo.find({ relations: { test: true } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: { test: true } }); }
  
  create(data: Partial<Question>) {
    const newItem = this.repo.create(data);
    return this.repo.save(newItem);
  }

  async update(id: number, data: Partial<Question>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) { await this.repo.delete(id); }
}

