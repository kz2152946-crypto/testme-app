import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestResult } from './test-result.entity';
import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestResult])],
  providers: [TestResultsService],
  controllers: [TestResultsController],
})
export class TestResultsModule {}

