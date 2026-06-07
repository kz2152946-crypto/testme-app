import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private service: QuestionsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() create(@Body() data: Partial<Question>) { return this.service.create(data); }
  @Put(':id') update(@Param('id') id: string, @Body() data: Partial<Question>) { return this.service.update(+id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}

