import * as dotenv from "dotenv";
dotenv.config();

import { runExpress } from "./server/index.js";

const password = process.env.PASSWORD;
const port = 3000;

runExpress({ port, password });
