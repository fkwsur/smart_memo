import * as base from './base';

export namespace Chronicle {
  export interface ChronicleDTO extends base.BaseModel, base.CommonModel {
    content: string;
    end_date: Date;
  }
  export interface Token {
    accessToken?: string;
    refreshToken?: string;
  }
}
