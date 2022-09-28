import express from "express";
const router = express.Router();

let pipeVariables = {
  airHumidity: undefined,
  soilHumidity: undefined,
  temperature: undefined,
  light: undefined,
  isBulbOn: 0,
  isFanOn: 0,
  isPumpOn: 0,
  lastPipeConnection: undefined,
};

router.get("/pipe", (req, res) => {
  const { headers } = req;
  let responseString;

  if (Boolean(headers["is-pipe"]) == true) {
    responseString = JSON.stringify({
      isBulbOn: pipeVariables.isBulbOn,
      isFanOn: pipeVariables.isFanOn,
      isPumpOn: pipeVariables.isPumpOn,
    });
  } else if (Boolean(headers["is-client"]) == true) {
    responseString = JSON.stringify(pipeVariables);
  } else {
    return res.send({
      message: 'Must send in header "is-pipe" or "is-client"',
    });
  }

  res.type("json");
  res.set("Content-Length", Buffer.byteLength(responseString, "utf-8"));

  if (pipeVariables.lastPipeConnection == undefined)
    return res.status(200).send({ message: "No pipe comunication" });
  res.send(responseString);
});

router.post("/pipe", (req, res) => {
  const { body, headers } = req;
  if (Boolean(headers["is-pipe"]) == true) {
    pipeVariables.airHumidity = body.airHumidity;
    pipeVariables.soilHumidity = body.soilHumidity;
    pipeVariables.temperature = body.temperature;
    pipeVariables.light = body.light;
    pipeVariables.lastPipeConnection = Date.now();
  } else if (Boolean(headers["is-client"]) == true) {
    pipeVariables.isBulbOn = body.isBulbOn;
    pipeVariables.isFanOn = body.isFanOn;
    pipeVariables.isPumpOn = body.isPumpOn;
  }

  res.status(203).send({ message: "Updated pipe" });
});

export { router as v1 };
