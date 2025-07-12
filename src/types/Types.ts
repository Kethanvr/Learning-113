import { Connection } from "mongoose";
import { promises } from "node:dns";

declare global {
  var mongoose :{
        conn : Connection | null,
        promise : Promise<Connection> | null
  }
}

export {}