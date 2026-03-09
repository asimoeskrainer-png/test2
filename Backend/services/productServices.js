import dbConn from "../db/models.js";

export async function getProductsWithPagination(page = 1, limit = 10, category = null) {

    // Parameter Parsing and Constraints
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    // Ensures page is a valid number starting from 1
    page = Math.max(1, page);

    // Applies a maximum limit constraint for performance/safety
    const MAX_LIMIT = 50;
    limit = Math.min(limit, MAX_LIMIT);

    // Calculate the starting position for the query
    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    // Dynamically build the WHERE clause and parameters if a category is provided
    if (category) {
        whereClause = "WHERE category = ?";
        params.push(category);
    }

    // Count Total Rows ---
    // Use parameterized query to get the total number of records matching the filter.
    const [countResult] = await dbConn.query(
        `SELECT COUNT(*) AS count FROM products ${whereClause}`,
        params
    );

    const total = countResult[0].count;

    // Fetch Paginated Rows ---
    // Fetch the actual data slice using LIMIT and OFFSET.
    const [rows] = await dbConn.query(
        `SELECT id, product_name, list_price, category
         FROM products
         ${whereClause}
         ORDER BY id ASC  
         LIMIT ? OFFSET ?`,
        // Parameters: [...category_param, limit, offset]
        [...params, limit, offset]
    );

    // Returns Results ---
    return {
        count: total,
        results: rows
    };
}