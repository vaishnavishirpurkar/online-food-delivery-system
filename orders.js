const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../database/orders.json');
const readOrders = () => JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8') || '[]');
const writeOrders = (data) => fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));

// Customer: Place a new order
router.post('/place', (req, res) => {
    const orders = readOrders();
    const newOrder = {
        id: "ORD" + Math.floor(100000 + Math.random() * 900000), // Random 6 digit ID
        customer_id: req.body.customer_id,
        restaurant_name: req.body.restaurant_name,
        delivery_address: req.body.delivery_address,
        items: req.body.items,
        total_amount: req.body.total_amount,
        status: "Placed", // Shuruat me status humesha Placed hoga
        delivery_partner_id: ""
    };
    orders.push(newOrder);
    writeOrders(orders);
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
});

// Customer/Admin: Get order details by ID (For Live Tracking)
router.get('/:id', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
});

// Admin: Update order status (Placed -> Preparing -> Food Prepared)
router.put('/update-status/:id', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status; // e.g., "Preparing" or "Food Prepared"
    writeOrders(orders);
    res.json({ message: "Order status updated by admin", order });
});

module.exports = router;