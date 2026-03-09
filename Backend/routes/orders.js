import express from 'express';
import {createOrder} from "../services/orderServices.js";

const orderRouter = express.Router();

orderRouter.post('/', async (req, res) => {

    const {customer, order_details: items} = req.body

    console.log("Received customer data:", customer)
    console.log("Received order items:", items)

    if (!customer || !items || items.length === 0) {
        return res.status(400).json({message: "Invalid order data: Customer or items are missing/empty."})
    }

    try {
        const result = await createOrder({customer, items})
        console.log("Result is:", result)

        res.status(201).json({
            message: "Order created successfully",
            orderId: result.orderId
        })
    } catch (error) {

        console.error('Error creating order in service:', error.message || error);

        res.status(500).json({message: "Internal server error during order processing."})
    }
});


export default orderRouter;