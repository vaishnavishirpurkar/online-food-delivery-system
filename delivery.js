const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../database/orders.json');
const readOrders = () => JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8') || '[]');
const writeOrders = (data) => fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));

// Get all orders for Delivery panel
router.get('/orders', (req, res) => {
    res.json(readOrders());
});

// Rider accepts order
router.put('/accept-order/:id', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.delivery_partner_id = req.body.delivery_partner_id;
    order.status = "On the way"; // Status changes for user tracking
    writeOrders(orders);
    res.json({ message: "Order accepted by rider", order });
});

// Rider updates status (On the way -> Food Picked Up -> Delivered)
router.put('/update-status/:id', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    writeOrders(orders);
    res.json({ message: "Status updated by rider", order });
});

module.exports = router;