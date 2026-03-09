import express from "express";
import cors from "cors";
import router from "./routes/products.js";
import orderRouter from "./routes/orders.js";
import pool from "./db/models.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", router)
app.use("/api/orders", orderRouter)

app.get('/', async (req, res) => {
    res.send('The server is running');
});


app.listen(3000, () => {
    console.log("listening on port 3000...");
});