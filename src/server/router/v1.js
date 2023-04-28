import {
  pullVariableRecord,
  pullProcessRecord,
  fetchVariableRecord,
  fetchProcessRecord,
} from "../db.js";

import express from "express";
const router = express.Router();

router.get("/pipe", async (req, res) => {
  const { headers } = req;
  let responseString;

  const processRecord = await pullProcessRecord();
  if (Boolean(headers["is-pipe"]) == true) {
    responseString = JSON.stringify(processRecord);
  } else if (Boolean(headers["is-client"]) == true) {
    const variableRecord = await pullVariableRecord();
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

router.post("/pipe", async (req, res) => {
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
