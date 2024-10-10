import * as shortid from 'shortid';
import { Injectable } from '@nestjs/common';
import { Chronicle } from 'src/domain/chronicle';
import { Repository } from '../repository';
import { Utils } from '../utils';
import { VectorDB } from '../service/vectorDB';

@Injectable()
export class ChronicleService {
  constructor(
    private readonly repo: Repository,
    private readonly u: Utils,
  ) {}

  async Create(req: Chronicle.ChronicleDTO): Promise<Error | true> {
    try {
      req.id = shortid.generate();
      let date = new Date(req.end_date);
      date.setHours(date.getHours() + 9);
      req.end_date = date;
      VectorDB.prototype.Insert(req.content);
      return await this.repo.ledgerRepository.Create(req);
    } catch (error) {
      throw error;
    }
  }

  async Read(): Promise<Error | Chronicle.ChronicleDTO[]> {
    try {
      return await this.repo.ledgerRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async Search(keyword : string): Promise<Error | any[]> {
    try {
      return await VectorDB.prototype.Search(keyword);
    } catch (error) {
      throw error;
    }
  }

  async Ranking(): Promise<Error | any[]> {
    try {
      return await VectorDB.prototype.Ranking();
    } catch (error) {
      throw error;
    }
  }

  async Delete(req: Chronicle.ChronicleDTO): Promise<Error | true> {
    try {
      return await this.repo.ledgerRepository.Delete(req.id);
    } catch (error) {
      throw error;
    }
  }

}
