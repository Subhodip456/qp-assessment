const db = require("../config/db");

// Get all available grocery items
exports.getGroceryItems = async (req, res) => {
  try {
    const [items] = await db.query("SELECT * FROM grocery_items WHERE inventory > 0");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Place an order
exports.placeOrder = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  try {
    // Begin transaction
    await db.query("START TRANSACTION");

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const [grocery] = await db.query(
        "SELECT price, inventory FROM grocery_items WHERE id = ?",
        [item.grocery_item_id]
      );

      if (!grocery.length || grocery[0].inventory < item.quantity) {
        throw new Error(`Insufficient inventory for item ID ${item.grocery_item_id}`);
      }

      totalPrice += grocery[0].price * item.quantity;

      // Update inventory
      await db.query(
        "UPDATE grocery_items SET inventory = inventory - ? WHERE id = ?",
        [item.quantity, item.grocery_item_id]
      );
    }

    // Insert order
    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, total_price, created_at) VALUES (?, ?, NOW())",
      [userId, totalPrice]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, grocery_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.grocery_item_id, item.quantity, item.quantity * grocery[0].price]
      );
    }

    // Commit transaction
    await db.query("COMMIT");

    res.json({ message: "Order placed successfully.", order_id: orderId });
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
};
