import { Injectable } from "@nestjs/common";
import { Infrastructure } from "src/infrastructure";
import { Prisma } from "@prisma/client";
import { Chronicle } from "src/domain/chronicle";

@Injectable()
export class LedgerRepository {
    constructor(
        private readonly infrastructure: Infrastructure,
    ){};

    async Create(ledger: Prisma.LedgerCreateInput):Promise<Error | true>{
        try {
            await this.infrastructure
                .mysql
                .ledger
                .create({
                    data: ledger,
                });
            return true;
        } catch (error) {
            throw error;
        }
    }

    async findAll():Promise<Chronicle.ChronicleDTO[]>{
        try {
            return await this.infrastructure
                .mysql
                .ledger
                .findMany({
                    orderBy : { end_date : 'desc'}
                });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id : string):Promise<Error | true>{
        try {
             await this.infrastructure
                .mysql
                .ledger
                .delete({
                    where: { id: id }
                });
            return true;
        } catch (error) {
            throw error;
        }
    }
}