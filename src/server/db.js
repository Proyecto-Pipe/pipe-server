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
        pool.getConnection((error, connection) => {
          if (error) throw error;
          connection.query(sql, (error, result) => {
            if (error) reject(error);
            pool.releaseConnection(connection);
            console.log("Realeased");
            resolve(result);
          });
        });
      });
    };
  });
}

function convertToISO(date) {
  // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime#comment92061514_11150727
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}

function datetimeNow() {
  // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime#comment92061514_11150727
  return convertToISO(new Date());
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return convertToISO(result);
}

function pullVariableRecord({ date }, pipeId = PIPE_PROTOTYPE_ID) {
  return query(`SELECT date, airHumidity, soilHumidity, temperature, light
                FROM variablerecords
                WHERE pipeId = ${pipeId}
                ${
                  date
                    ? `AND date BETWEEN "${date} 05:00:00" AND "${addDays(
                        date,
                        1
                      )} 05:00:00"`
                    : ""
                }
                ORDER BY date DESC`);
}

function pullProcessRecord({ date, limit }, pipeId = PIPE_PROTOTYPE_ID) {
  return query(`SELECT date, isBulbOn, isPumpOn, isFanOn, automation
                FROM processrecords
                WHERE pipeId = ${pipeId}
                ${
                  date
                    ? `AND date BETWEEN "${date} 00:00:00" AND "${addDays(
                        date,
                        1
                      )} 05:00:00"`
                    : ""
                }
                ORDER BY date DESC
                ${limit ? `LIMIT ${limit}` : ""}
                `);
}

function fetchVariableRecord(variables, pipeId = PIPE_PROTOTYPE_ID) {
  for (const variable in variables) {
    if (isNaN(variables[variable]) === true) {
      variables[variable] = 0.0;
    }
  }
  return query(`INSERT INTO variablerecords (date, airHumidity, soilHumidity, temperature, light, pipeId)
                VALUES ("${datetimeNow()}", ${variables.airHumidity}, ${
    variables.soilHumidity
  }, ${variables.temperature}, ${variables.light}, ${pipeId})`);
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
