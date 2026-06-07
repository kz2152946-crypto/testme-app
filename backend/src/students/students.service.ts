import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  
  async create(data: Partial<Student>) {
    // Хешируем пароль перед сохранением
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const newStudent = this.repo.create(data);
    return this.repo.save(newStudent);
  }

  async update(id: number, data: Partial<Student>) {
    // Если обновляется пароль — хешируем его
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Студент не найден');
  }

  async login(email: string, password: string) {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    const student = await this.repo.findOne({ where: { email: cleanEmail } });
    
    if (!student) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    
    // Сравниваем введённый пароль с хешем в базе
    const isPasswordValid = await bcrypt.compare(cleanPassword, student.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }
    
    return student;
  }
}

