import mysql from "mysql2";

let PIPE_PROTOTYPE_ID;

let query = (sql) => {
  // throw new Error("Not query function defined, connection not started");
};

function connectToDb({ database, host, user, password, pipePrototypeId }) {
  PIPE_PROTOTYPE_ID = pipePrototypeId;

  const pool = mysql.createPool({
    database,
    host,
    user,
    password,
    waitForConnections: true,
    connectionLimit: 10,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
    dateStrings: true,
  });
  pool.getConnection((error, connection) => {
    if (error) throw error;
    console.log(`Connected to ${database} DB.`);

    query = (sql) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, (error, result) => {
          if (error) reject(error);
          resolve(result);
          pool.releaseConnection(connection);
        });
      });
    };
  });
}

function datetimeNow() {
  // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime#comment92061514_11150727
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function pullVariableRecord({ date1, date2 }, pipeId = PIPE_PROTOTYPE_ID) {
  return query(`SELECT date, airHumidity, soilHumidity, temperature, light
                FROM variablerecords
                WHERE pipeId = ${pipeId}
                ${date1 ? `AND date BETWEEN "${date1}" AND "${date2}"` : ""}
                ORDER BY date DESC`);
}

function pullProcessRecord(
  { date1, date2, limit },
  pipeId = PIPE_PROTOTYPE_ID
) {
  return query(`SELECT date, isBulbOn, isPumpOn, isFanOn, automation
                FROM processrecords
                WHERE pipeId = ${pipeId}
                ${date1 ? `AND date BETWEEN "${date1}" AND "${date2}"` : ""}
                ORDER BY date DESC
                ${limit ? `LIMIT ${limit}` : ""}
                `);
}

function fetchVariableRecord(
  { airHumidity, soilHumidity, temperature, light },
  pipeId = PIPE_PROTOTYPE_ID
) {
  return query(`INSERT INTO variablerecords (date, airHumidity, soilHumidity, temperature, light, pipeId)
                VALUES ("${datetimeNow()}", ${airHumidity}, ${soilHumidity}, ${temperature}, ${light}, ${pipeId})`);
}

function fetchProcessRecord(
  { isBulbOn, isFanOn, isPumpOn, automation },
  pipeId = PIPE_PROTOTYPE_ID
) {
  return query(`INSERT INTO processrecords (date, isBulbOn, isFanOn, isPumpOn, automation, pipeId)
                VALUES ("${datetimeNow()}", ${isBulbOn}, ${isFanOn}, ${isPumpOn}, ${automation}, ${pipeId})`);
}

export {
  connectToDb,
  pullVariableRecord,
  pullProcessRecord,
  fetchVariableRecord,
  fetchProcessRecord,
};
