import {createConnection} from "mysql2/promise";

//Verbindung mit der BD aufbauen.

const dbConn = await createConnection({
    host: "localhost",
    user: "root",
    password: "DeinSicheresPasswort",
    database: "northwind",
    waitForConnections: true,

});

console.log('Connected to database');

export default dbConn