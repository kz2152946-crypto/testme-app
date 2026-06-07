import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}

