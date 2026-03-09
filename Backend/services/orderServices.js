import models from "../db/models.js";

export async function createOrder({customer, items}) {
    const connection = await models.getConnection();
    let orderId = null;

    try {
        // Validate input data

        if (!customer.ship_name || !customer.ship_address) {
            throw new Error('Customer shipping information is incomplete');
        }
        if (!items || items.length === 0) {
            throw new Error('Order must contain at least one item');
        }
        // Validate each item
        for (const item of items) {
            if (!item.product_id || !item.quantity || item.quantity <= 0) {
                throw new Error('Invalid item data');
            }
        }

        // Start transaction
        await connection.beginTransaction();

        // Create order record
        const [orderResult] = await connection.query(
            `INSERT INTO orders
                 (order_date, ship_name, ship_city, ship_zip_postal_code, ship_address)
             VALUES (NOW(), ?, ?, ?, ?)`,
            [customer.ship_name,
                customer.ship_city,
                customer.ship_zip_postal_code,
                customer.ship_address
            ]
        );

        orderId = orderResult.insertId

        if (items.length === 1) {
            // Single item insert
            const item = items[0];
            await connection.query(
                `INSERT INTO order_details
                     (order_id, product_id, quantity, unit_price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.unit_price]
            );
        } else {
            // Batch insert for multiple items
            const values = items.map(item => [
                orderId,
                item.product_id,
                item.quantity,
                item.unit_price || 0
            ]);

            await connection.query(
                `INSERT INTO order_details
                     (order_id, product_id, quantity, unit_price)
                 VALUES ?`,
                [values]
            );
        }
        // Commit transaction
        await connection.commit();
        // Log success
        console.log(`Order ${orderId} created successfully with ${items.length} items`);

        return {
            success: true,
            orderId,
            message: `Order created successfully with ${items.length} items`
        };

    } catch (error) {
        console.error('Order creation failed', error);

        if (connection) {
            console.error("Transaction failed, performing ROLLBACK:", error);

            try {

                await connection.rollback();
                console.log('Transaction rolled back successfully');
            } catch (rollbackError) {
                console.log('Rollback failed:', rollbackError);
                error.rollbackError = rollbackError.message;
            }
        }

        throw error;

    } finally {

        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                console.error('Connection release failed:', releaseError);
            }
        }
    }
}