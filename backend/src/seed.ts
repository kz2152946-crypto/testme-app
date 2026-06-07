import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StudentsService } from './students/students.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const studentsService = app.get(StudentsService);

  try {
    // Создаём администратора
    console.log('Создаю администратора...');
    await studentsService.create({
      name: 'Администратор',
      group: 'ADMIN',
      email: 'admin@misis.ru',
      password: 'admin123',
    });

    // Создаём студентов
    console.log('Создаю Ксению...');
    await studentsService.create({
      name: 'Ксения Зобова',
      group: 'БИВТ-24-7',
      email: 'ksusazobova@misis.ru',
      password: '12345',
    });

    console.log('Создаю Ивана...');
    await studentsService.create({
      name: 'Иван Иванов',
      group: 'БИВТ-24-1',
      email: 'ivanov@misis.ru',
      password: '12345',
    });

    console.log('✅ Все пользователи созданы с захешированными паролями!');
  } catch (error) {
    console.error('❌ Ошибка при создании пользователей:', error);
  }

  await app.close();
  process.exit(0);
}

bootstrap();

