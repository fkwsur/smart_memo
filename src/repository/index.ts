import { Injectable } from "@nestjs/common";
import { Infrastructure } from "src/infrastructure";
import { LedgerRepository } from "./ledger";

@Injectable()
export class Repository {
    public ledgerRepository: LedgerRepository;
    constructor(
        infrastructure: Infrastructure,
    ){
        this.ledgerRepository = new LedgerRepository(infrastructure);
    }
}