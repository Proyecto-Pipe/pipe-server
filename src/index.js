import * as dotenv from "dotenv";
dotenv.config();

import { runExpress } from "./server/index.js";
import { connectToDb } from "./server/db.js";

const password = parseInt(process.env.PASSWORD);
const port = process.env.PORT || 8080;

const dev_mode = parseInt(process.env.DEV_MODE);
console.log("Dev mode: ");
console.log(dev_mode === 1 ? true : false);
let corsWhitelist = [
  "https://proyecto-pipe.github.io",
  "https://proyecto-pipe.github.io/",
];

if (dev_mode === 1) corsWhitelist.push(process.env.DEV_URL1);
if (dev_mode === 1) corsWhitelist.push(process.env.DEV_URL2);

console.log("Cors Whitelist: " + corsWhitelist);

runExpress({ port, password, corsWhitelist });

connectToDb({
  database: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pipePrototypeId: process.env.PIPE_PROTOTYPE_ID,
});
