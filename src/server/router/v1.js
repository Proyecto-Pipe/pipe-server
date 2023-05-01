import {
  pullVariableRecord,
  pullProcessRecord,
  fetchVariableRecord,
  fetchProcessRecord,
} from "../db.js";

import express from "express";
const router = express.Router();

// no piperecords code:
let lastClientConnection;
const CLIENT_CONNECTION_DURATION = 5;
router.get("/isclientonline", async (req, res) => {
  let isClientOnline;
  if (lastClientConnection !== undefined) {
    const diffInSeconds = Math.abs(lastClientConnection - new Date()) / 1000;
    if (diffInSeconds > CLIENT_CONNECTION_DURATION) {
      isClientOnline = false;
    } else if (diffInSeconds < CLIENT_CONNECTION_DURATION) {
      isClientOnline = true;
    }
  } else {
    isClientOnline = false;
  }
  res.status(200).send({ isClientOnline, lastClientConnection });
});

router.post("/isclientonline", async (req, res) => {
  lastClientConnection = new Date();
  res.status(200).send({ lastClientConnection });
});

let pipeVariables = {
  airHumidity: undefined,
  soilHumidity: undefined,
  temperature: undefined,
  light: undefined,
  lastPipeConnection: undefined,
};

router.get("/pipenow", (req, res) => {
  if (pipeVariables.lastPipeConnection == undefined) {
    res.status(200).send({ message: "No live pipe comunication" });
  } else {
    res.send(JSON.stringify(pipeVariables));
  }
});

router.post("/pipenow", (req, res) => {
  const { body } = req;
  pipeVariables.airHumidity = parseFloat(body.airHumidity).toFixed(2);
  pipeVariables.soilHumidity = parseFloat(body.soilHumidity).toFixed(2);
  pipeVariables.temperature = parseFloat(body.temperature).toFixed(2);
  pipeVariables.light = parseFloat(body.light).toFixed(2);
  pipeVariables.lastPipeConnection = Date.now();
  res.status(203).send({ pipeVariables });
});

// piperecords code:
router.get("/piperecords", async (req, res) => {
  const { headers, query } = req;
  let responseString;

  if (Boolean(headers["is-pipe"]) == true) {
    const processRecord = await pullProcessRecord({ limit: 1 });
    responseString = JSON.stringify(processRecord[0]);
  } else if (Boolean(headers["is-client"]) == true) {
    const processRecord = await pullProcessRecord({
      date: query.date,
    });
    const variableRecord = await pullVariableRecord({
      date: query.date,
    });
    responseString = JSON.stringify({ variableRecord, processRecord });
  } else {
    return res.send({
      message: 'Must send in header "is-pipe" or "is-client"',
    });
  }

  res.type("json");
  res.set("Content-Length", Buffer.byteLength(responseString, "utf-8"));
  res.status(200).send(responseString);
});

router.post("/piperecords", async (req, res) => {
  const { body, headers } = req;
  if (Boolean(headers["is-pipe"]) == true) {
    const response = await fetchVariableRecord({
      airHumidity: parseFloat(body.airHumidity).toFixed(2),
      soilHumidity: parseFloat(body.soilHumidity).toFixed(2),
      temperature: parseFloat(body.temperature).toFixed(2),
      light: parseFloat(body.light).toFixed(2),
    });
    res.status(203).send(response);
  } else if (Boolean(headers["is-client"]) == true) {
    const response = await fetchProcessRecord({
      isBulbOn: body.isBulbOn,
      isFanOn: body.isFanOn,
      isPumpOn: body.isPumpOn,
      automation: body.automation,
    });
    res.status(203).send(response);
  }
});

export { router as v1 };
