import * as dotenv from "dotenv";
dotenv.config();

import { runExpress } from "./server/index.js";

const password = parseInt(process.env.PASSWORD);
const port = process.env.PORT || 5000;

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
