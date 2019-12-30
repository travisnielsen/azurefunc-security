import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Orders example')
    .setDescription('The orders API description')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  try {
    fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
    SwaggerModule.setup('api', app, document);
  } catch(e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }

  await app.listen(3000);
}
bootstrap();
