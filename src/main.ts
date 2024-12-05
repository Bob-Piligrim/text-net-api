import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Документация Swagger
  const config = new DocumentBuilder()
    .setTitle('text-net-api')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Авторизация между обновлениями страницы
    },
  });
  // Сохраняем спецификацию в JSON файл
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  await app.listen(3000);
}
bootstrap();
