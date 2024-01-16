const mysql = require('mysql2');
require('dotenv').config();

let { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT } = process.env;
// console.log(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT);


const createConnection = async () => {
  return new Promise((resolve, reject) => {
    const mydb = mysql.createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      port: MYSQL_PORT
    });
    mydb.connect((err) => {
      if (err) {
        console.log(`Error in db connection: ${err}`);
        reject(err);
      } else {
        resolve(mydb);
      }
    });
  });
}

const closeConnection = (mydb) => {
  return new Promise((resolve, reject) => {
    mydb.end((err) => {
      if (err) {
        console.error(`Error in closing db connection. Error: ${err}`);
        reject(err);
      } else {
        console.log('Database connection closed successfully.');
        resolve(mydb);
      }
    });
  });
};

const getRecord = async (mydb, dbName, tableName) => {
  let sqlQuery = `SELECT * FROM ${dbName}.${tableName} WHERE ts=0 LIMIT 1000;`;
  let result = await executeCommand(mydb, sqlQuery);
  return result;
};



const executeCommand = async (mydb, sqlQuery) => {
  return new Promise((resolve, reject) => {
    mydb.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(`Error in executing command. Error: ${err}\nQuery : ${sqlQuery}`);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const executeQuery = async (mydb, sqlQuery, data) => {
  return new Promise((resolve, reject) => {
    mydb.query(sqlQuery, data, (err, res) => {
      if (err) {
        console.log(`Error in executing query. Error: ${err}`);
        console.log(`sql query: ${sqlQuery}\ndata: ${JSON.stringify(data)}}`);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


module.exports = {
  createConnection,
  closeConnection,
  executeCommand,
  executeQuery,
  getRecord,
}
