import express from "express";
const router = express.Router();

let pipeVariables = {
  humidity: undefined,
  temperature: undefined,
  light: undefined,
  isBulbOn: undefined,
  isPumpOn: undefined,
  // [sec, min, hou, day, mont, yea]
  lastPipeConection: undefined,
};

router.get("/pipe", (req, res) => {
  if (pipeVariables.lastPipeConection == undefined)
    return res.status(200).send({ message: "No pipe comunication" });
  res.send(pipeVariables);
});

router.post("/pipe", (req, res) => {
  const { body } = req;
  pipeVariables.humidity = body.humidity;
  pipeVariables.temperature = body.temperature;
  pipeVariables.light = body.light;
  pipeVariables.isBulbOn = body.isBulbOn;
  pipeVariables.isPumpOn = body.isPumpOn;

  res.status(203).send({ message: "Updated pipe" });
});

export { router as v1 };
