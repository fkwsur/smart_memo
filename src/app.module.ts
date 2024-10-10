import { Module } from '@nestjs/common';
import { Controller } from './application';
import { Service } from './service';
import {Infrastructure} from "./infrastructure";
import { Repository } from './repository';
import { Utils } from './utils';

@Module({
  imports: [],
  controllers: Controller,
  providers: [Service,Infrastructure,Repository,Utils],
  exports: [
    Repository,
    Infrastructure,
    Service,
    Utils
  ]
})
export class AppModule {}
