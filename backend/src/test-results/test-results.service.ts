import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from './test-result.entity';

@Injectable()
export class TestResultsService {
  constructor(@InjectRepository(TestResult) private repo: Repository<TestResult>) {}

  findAll() { return this.repo.find({ relations: { student: true, test: true } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: { student: true, test: true } }); }
  
  create(data: Partial<TestResult>) {
    const newItem = this.repo.create(data);
    return this.repo.save(newItem);
  }

  async update(id: number, data: Partial<TestResult>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) { await this.repo.delete(id); }
}

