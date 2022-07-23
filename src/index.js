import { runExpress } from "./server/index.js";

const password = 123;
const port = 3000;

runExpress({ port, password });
