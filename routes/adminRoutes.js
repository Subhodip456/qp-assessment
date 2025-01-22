const express = require("express");
const { addGroceryItem, getGroceryItems, updateGroceryItem, deleteGroceryItem } = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/grocery-items", authenticate, authorize(["admin"]), addGroceryItem);
router.get("/grocery-items", authenticate, authorize(["admin"]), getGroceryItems);
router.put("/grocery-items/:id", authenticate, authorize(["admin"]), updateGroceryItem);
router.delete("/grocery-items/:id", authenticate, authorize(["admin"]), deleteGroceryItem);

module.exports = router;
