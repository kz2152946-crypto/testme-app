import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';

@Injectable()
export class TestsService {
  constructor(@InjectRepository(Test) private repo: Repository<Test>) {}

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  
  create(data: Partial<Test>) {
    const newTest = this.repo.create(data);
    return this.repo.save(newTest);
  }

  async update(id: number, data: Partial<Test>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Тест не найден');
  }
}

