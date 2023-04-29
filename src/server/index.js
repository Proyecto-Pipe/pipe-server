import express from "express";
const app = express();
import bodyParser from "body-parser";
import * as cors from "cors";

import { v1 } from "./router/v1.js";

function runExpress({ port, password, corsWhitelist }) {
  function applyPassword(req, res, next) {
    if (parseInt(req.headers["password"]) !== password)
      return res.status(403).send({ message: "Unauthorized" });
    else next();
  }

  app.use(
    cors.default({
      origin: (origin, callback) => {
        if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
          console.log(`Connection with ${origin}`);
          callback(null, true);
        } else {
          console.log(`NO connection with ${origin}`);
          callback(null, false);
        }
      },
    })
  );

  app.use(bodyParser.json());
  app.use(applyPassword);
  app.use("/v1", v1);

  app.get("/", (req, res) =>
    res.status(404).send({ message: "No path specified" })
  );
  app.listen(port, () => {
    console.log(`Pipe server running on ${port}`);
  });
}

export { runExpress };
