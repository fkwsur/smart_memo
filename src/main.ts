import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const { VectorDB } = require("./service/vectorDB");
const cors = require("cors");

const vd = new VectorDB();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 백터디비 컬렉션 생성
  vd.CreateDB();
  app.use(cors());
  await app.listen(8081);
}
bootstrap();
