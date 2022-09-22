import express from "express";
const app = express();
import bodyParser from "body-parser";
import * as cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();

import { v1 } from "./router/v1.js";

const dev_mode = parseInt(process.env.DEV_MODE);
console.log("Dev mode: ");
console.log(dev_mode === 1 ? true : false);

let corsWhitelist = ["https://santigo171.github.io/"];

if (dev_mode === 1) corsWhitelist.push(process.env.DEV_URL1);
if (dev_mode === 1) corsWhitelist.push(process.env.DEV_URL2);

console.log("Cors Whitelist: " + corsWhitelist);

function runExpress({ port, password }) {
  function applyPassword(req, res, next) {
    if (parseInt(req.headers.password) !== password)
      return res.status(403).send({ message: "Unauthorized" });
    else next();
  }

  app.use(
    cors.default({
      origin: (origin, callback) => {
        console.log(origin);
        console.log(corsWhitelist.indexOf(origin) !== -1 || !origin);
        if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    })
  );

  app.use(bodyParser.json());
  app.use("/v1", v1);
  app.use(applyPassword);

  app.get("/", (req, res) =>
    res.status(404).send({ message: "No path specified" })
  );
  app.listen(port, () => {
    console.log(`Pipe server running on ${port}`);
  });
}

export { runExpress };
