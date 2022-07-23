import * as dotenv from "dotenv";
dotenv.config();

import { runExpress } from "./server/index.js";

const password = parseInt(process.env.PASSWORD);
const port = process.env.PORT || 3000;

runExpress({ port, password });
