import { Injectable } from "@nestjs/common";
import { Aws } from "./aws"

@Injectable()
export class Utils {
    public aws: Aws;
    constructor(
    ) {
        this.aws = new Aws();
    }
}