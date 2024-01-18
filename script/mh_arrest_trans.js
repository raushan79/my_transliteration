require('dotenv').config();


const { createConnection, closeConnection, getRecord, executeCommand, executeQuery } = require('../database.js');
const { transToEng } = require('../trans.js');

// environment variables
let dbName = process.env.DB_NAME;
let recordTable = process.env.MH_RECORD_TABLE;


const startTrasnliteration = async (mydb) => {
    let recordList = await getRecord(mydb, dbName, recordTable);
    let totalRecord = recordList.length;
    if (totalRecord > 0) {
        for (let i = 0; i < totalRecord; i++) {
            console.log(recordList[i]);
            let { id, person_name_regional } = recordList[i];
            let person_name = await transToEng(person_name_regional);

            let sqlQuery = `UPDATE ${dbName}.${recordTable} SET person_name='${person_name}', ts=1 WHERE id='${id}';`;
            await executeCommand(mydb, sqlQuery);
            console.log(`trans details updated for id : ${id}.\n________________`);

        }
        await startTrasnliteration(mydb);
    } else {
        console.log(`No records for transliteration.\n________________`);
        await closeConnection(mydb);
    }
}


(
    async () => {
        let mydb = await createConnection();
        await startTrasnliteration(mydb);
        console.log(`Done.\n________________`);
    }
)()