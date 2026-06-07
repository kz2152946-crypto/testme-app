import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from './test.entity';

@Controller('tests')
export class TestsController {
  constructor(private service: TestsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() create(@Body() data: Partial<Test>) { return this.service.create(data); }
  @Put(':id') update(@Param('id') id: string, @Body() data: Partial<Test>) { return this.service.update(+id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}

