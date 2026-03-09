import pool from "./db/models.js";

async function testConnection(){
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM products");
    console.log(rows[0].total)
}
testConnection();