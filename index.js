const sql = require('mssql')

const express = require('express')
const app = express()
const port = 3000

var dummyNames = require('./Misc/NameGenerator');

const sqlConfig = {
    user: "sa2",
    password: "Metval123",
    database: "test",
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

app.get('/', async (req, res) => {

    try {
        // SQL calls 'must' be asynchronous- so we need to await them

        console.log("- Inserting single records: ");
        await InsertRecord(dummyNames.genName(), dummyNames.genName());

        console.log("- List records: ");
        await ListRecords();

        console.log("- Get record from SP: ");
        await GetRecordStoredProc(4);

        console.log(dummyNames.genNames())
    } catch (err) {
        // ... error checks
    }
    res.send('Hello World!')

})

//---------------------------------------------------------
// Get all records 
//---------------------------------------------------------
// Since it takes time to query a db, functions that execute queries *must* be asynchronous- so we need to await it
async function ListRecords() {
    try {
        var conn = await sql.connect(sqlConfig)
        const result = await conn.query(`SELECT * FROM tblTest`);

        console.info(JSON.stringify(result.recordsets));
    } catch (err) {
        console.error(err)
    }
}

//---------------------------------------------------------
// Insert single record
//---------------------------------------------------------
async function InsertRecord(firstName, secondName) {
    try {
        var conn = await sql.connect(sqlConfig)
        const result = await conn.query(`INSERT INTO tblTest(Name, Surname) VALUES ('` + firstName + `','` + secondName + `')`);

        console.info("Inserted Record Successfully");
    } catch (err) {
        console.error(err)
    }
}

//---------------------------------------------------------
// Insert single record
//---------------------------------------------------------
async function GetRecordStoredProc(id) {
    try {
        var conn = await sql.connect(sqlConfig)

        var request = new sql.Request(conn);
        request.input('testId', id);

        request.execute('ViewTest').then(function (recordsets, err) {
            console.dir(recordsets.recordset);
            //console.dir(err);
        }).catch(function (err) {
            console.log(err);
        });
    } catch (err) {
        console.error(err)
    }
}


//---------------------------------------------------------
// Insert several records
//---------------------------------------------------------

async function InsertSeveralRecords(names) {
    try {
        // Begin a transaction
        // a) MUCH better performance
        // b) If there is an error during insert- we can rollback all our changes
        const transaction = new sql.Transaction();

        transaction.begin(err => {
            // Error check
            if (err)
                console.error(err);

            const request = new sql.Request(transaction)
            request.query(`INSERT INTO tblTest(Name, Surname) VALUES ('N2','F2')`, (err, result) => {
                // If an error occurs, we rollback the transaction
                if (err) {
                    if (!rolledBack) {
                        transaction.rollback(err => {
                            console.error("An error occurred when attempting to roll back the transaction. " + err);
                        })
                    }
                }
                else {
                    transaction.commit(err => {
                        console.log("Transaction committed.")
                    })
                }
            }); // - End of Query
        })
    } catch (err) {
        console.error(err)
    }
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})