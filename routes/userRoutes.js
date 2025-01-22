const express = require("express");
const { getGroceryItems, placeOrder } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/grocery-items", authenticate, getGroceryItems);
router.post("/orders", authenticate, placeOrder);

module.exports = router;
