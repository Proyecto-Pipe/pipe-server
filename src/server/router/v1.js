import express from "express";
const router = express.Router();

let pipeVariables = {
  humidity: undefined,
  temperature: undefined,
  light: undefined,
  isBulbOn: undefined,
  isPumpOn: undefined,
  lastPipeConnection: undefined,
};

router.get("/pipe", (req, res) => {
  const pipeVariablesString = JSON.stringify(pipeVariables);
  res.type("json");
  res.header("User-Agent");
  res.set("Content-Length", Buffer.byteLength(pipeVariablesString, "utf-8"));
  if (pipeVariables.lastPipeConnection == undefined)
    return res.status(200).send({ message: "No pipe comunication" });
  res.send(pipeVariablesString);
});

router.post("/pipe", (req, res) => {
  const { body } = req;
  pipeVariables.humidity = body.humidity;
  pipeVariables.temperature = body.temperature;
  pipeVariables.light = body.light;
  pipeVariables.isBulbOn = body.isBulbOn;
  pipeVariables.isPumpOn = body.isPumpOn;
  pipeVariables.lastPipeConnection = Date.now();

  res.status(203).send({ message: "Updated pipe" });
});

export { router as v1 };
