import express from "express";
const router = express.Router();

let pipeVariables = {
  airHumidity: undefined,
  soilHumidity: undefined,
  temperature: undefined,
  light: undefined,
  isBulbOn: undefined,
  isFanOn: undefined,
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
  pipeVariables.airHumidity = body.airHumidity;
  pipeVariables.soilHumidity = body.soilHumidity;
  pipeVariables.temperature = body.temperature;
  pipeVariables.light = body.light;
  pipeVariables.isBulbOn = body.isBulbOn;
  pipeVariables.isFanOn = body.isFanOn;
  pipeVariables.isPumpOn = body.isPumpOn;
  pipeVariables.lastPipeConnection = Date.now();

  res.status(203).send({ message: "Updated pipe" });
});

export { router as v1 };
