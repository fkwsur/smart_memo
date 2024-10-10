import { Controller, Get, Param, Query, Req , Headers, Post, Body} from '@nestjs/common';
import { Chronicle } from 'src/domain/chronicle';
import { Service } from '../service';
import * as r from "./response";

@Controller("api/v1/chronicle")
export class ChronicleController {
  constructor(
    private readonly svc: Service
    ) {}

  @Post("/create")
  async Create(@Body() req : Chronicle.ChronicleDTO): Promise<any>  {
   try {
     await this.svc.chronicleService.Create(req);
     return r.Result(0);
   } catch (error) {
    return r.Error(error);
   }
  }

  @Get("/read")
  async Read(): Promise<any>  {
   try {
    return this.svc.chronicleService.Read();
   } catch (error) {
    return r.Error(error);
   }
  }

  @Get("/search")
  async Search(@Query("keyword") keyword : string): Promise<any>  {
   try {
    return this.svc.chronicleService.Search(keyword);
   } catch (error) {
    return r.Error(error);
   }
  }

  @Get("/ranking")
  async Ranking(): Promise<any>  {
   try {
    return this.svc.chronicleService.Ranking();
   } catch (error) {
    return r.Error(error);
   }
  }

  @Post("/delete")
  async Delete(@Body() req : Chronicle.ChronicleDTO): Promise<any>  {
   try {
    await this.svc.chronicleService.Delete(req);
    return r.Result(0);
   } catch (error) {
    return r.Error(error);
   }
  }


}
