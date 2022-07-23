import express from "express";
const app = express();
import bodyParser from "body-parser";

import { v1 } from "./router/v1.js";

function runExpress({ port, password }) {
  function applyPassword(req, res, next) {
    if (parseInt(req.headers.password) !== password)
      return res.status(403).send({ message: "Unauthorized" });
    else next();
  }

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
