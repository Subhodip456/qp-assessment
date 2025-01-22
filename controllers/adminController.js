const db = require("../config/db");

// Add a new grocery item
exports.addGroceryItem = async (req, res) => {
  const { name, description, price, inventory } = req.body;
  try {
    await db.query(
      "INSERT INTO grocery_items (name, description, price, inventory, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, description, price, inventory]
    );
    res.status(201).json({ message: "Grocery item added successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all grocery items
exports.getGroceryItems = async (req, res) => {
  try {
    const [items] = await db.query("SELECT * FROM grocery_items");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a grocery item
exports.updateGroceryItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, inventory } = req.body;
  try {
    await db.query(
      "UPDATE grocery_items SET name = ?, price = ?, inventory = ?, updated_at = NOW() WHERE id = ?",
      [name, price, inventory, id]
    );
    res.json({ message: "Grocery item updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a grocery item
exports.deleteGroceryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM grocery_items WHERE id = ?", [id]);
    res.json({ message: "Grocery item deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
