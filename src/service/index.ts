import { Injectable } from "@nestjs/common";
import { ChronicleService } from "./chronicle"
import { VectorDB } from "./vectorDB"
import { Repository } from "../repository";
import { Utils } from "../utils";

@Injectable()
export class Service {
    public chronicleService: ChronicleService;
    public vectorDB: VectorDB;
    constructor(
        repo : Repository,
        utils : Utils,
    ) {
        this.chronicleService = new ChronicleService(repo,utils);
        this.vectorDB = new VectorDB(repo,utils);
    }
}