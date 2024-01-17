const mysql = require('mysql2');
require('dotenv').config();
// for ssh connections
const { Client } = require("ssh2");
const sshClient = new Client();

let { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, SSH_HOST, SSH_PORT, SSH_USER, SSH_PASSWORD } = process.env;
// console.log(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT);


const dbServer = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  port: MYSQL_PORT,
};

const tunnelConfig = {
  host: SSH_HOST,
  port: SSH_PORT,
  user: SSH_USER,
  password: SSH_PASSWORD,
};

const forwardConfig = {
  srcHost: dbServer.host,
  srcPort: dbServer.port,
  dstHost: dbServer.host,
  dstPort: dbServer.port,
};

// using ssh
const createConnection = async () => {
  return new Promise((resolve, reject) => {
      sshClient
          .on("ready", () => {
              sshClient.forwardOut(
                  forwardConfig.srcHost,
                  forwardConfig.srcPort,
                  forwardConfig.dstHost,
                  forwardConfig.dstPort,
                  (err, stream) => {
                      if (err) reject(err);
                      const updatedDbServer = {
                          ...dbServer,
                          stream,
                      };
                      const connection = mysql.createConnection(updatedDbServer);
                      connection.connect((error) => {
                          if (error) {
                              reject(error);
                          }
                          resolve(connection);
                      });
                  }
              );
          })
          .connect(tunnelConfig);
  });

}


// // without ssh
// const createConnection = async () => {
//   return new Promise((resolve, reject) => {
//     const mydb = mysql.createConnection({
//       host: MYSQL_HOST,
//       user: MYSQL_USER,
//       password: MYSQL_PASSWORD,
//       port: MYSQL_PORT
//     });
//     mydb.connect((err) => {
//       if (err) {
//         console.log(`Error in db connection: ${err}`);
//         reject(err);
//       } else {
//         resolve(mydb);
//       }
//     });
//   });
// }

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
