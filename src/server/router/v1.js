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

  if (Boolean(headers["is-pipe"]) == true) {
    const processRecord = await pullProcessRecord({ limit: 1 });
    responseString = JSON.stringify(processRecord[0]);
  } else if (Boolean(headers["is-client"]) == true) {
    const processRecord = await pullProcessRecord();
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
