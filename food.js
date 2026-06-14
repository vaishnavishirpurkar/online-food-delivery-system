const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const foodsFilePath = path.join(__dirname, '../database/foods.json');
const restFilePath = path.join(__dirname, '../database/restaurants.json');

const readData = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
const writeData = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Get all restaurants
router.get('/restaurants', (req, res) => {
    res.json(readData(restFilePath));
});

// Get all food items
router.get('/', (req, res) => {
    res.json(readData(foodsFilePath));
});

// Admin: Add new food item
router.post('/', (req, res) => {
    const foods = readData(foodsFilePath);
    const newFood = { id: "food_" + Date.now(), ...req.body };
    foods.push(newFood);
    writeData(foodsFilePath, foods);
    res.status(201).json({ message: "Food item added!", food: newFood });
});

// Admin: Delete food item
router.delete('/:id', (req, res) => {
    let foods = readData(foodsFilePath);
    foods = foods.filter(f => f.id !== req.params.id);
    writeData(foodsFilePath, foods);
    res.json({ message: "Food item deleted successfully!" });
});

module.exports = router;