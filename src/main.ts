import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const { VectorDB } = require("./service/vectorDB");
const cors = require("cors");

const vd = new VectorDB();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  vd.CreateDB();
  app.use(cors());
  await app.listen(8081);
}
bootstrap();
