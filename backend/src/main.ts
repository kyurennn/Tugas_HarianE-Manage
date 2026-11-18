import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan CORS agar frontend (React + Vite di port 5173) dapat mengakses API backend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`=======================================================`);
  console.log(` Student Directory API Backend`);
  console.log(` Berjalan pada : http://localhost:${port}`);
  console.log(` Endpoint Mahasiswa : http://localhost:${port}/students`);
  console.log(`=======================================================`);
}

await bootstrap();
