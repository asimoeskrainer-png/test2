import express from "express"
import {getProductsWithPagination} from "../services/productServices.js";



const router = express.Router();

router.get("/", async (req, res)=>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const category = req.query.category || null

    const products = await getProductsWithPagination(page, limit, category);
    res.json(products)


})
export default router