import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { TestResult } from './test-result.entity';

@Controller('test-results')
export class TestResultsController {
  constructor(private service: TestResultsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() create(@Body() data: Partial<TestResult>) { return this.service.create(data); }
  @Put(':id') update(@Param('id') id: string, @Body() data: Partial<TestResult>) { return this.service.update(+id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}

