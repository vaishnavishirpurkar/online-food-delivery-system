const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Taaki frontend aur backend bina kisi error ke connect ho sake

const app = express();
const PORT = 3000;

// ==========================================
// 1. MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json()); // Ye bohot jaroori hai POST aur PUT requests ka data read karne ke liye

// ==========================================
// 2. FOODS & RESTAURANTS APIS (FIXED ABSOLUTE PATHS)
// ==========================================

// Home Route
app.get("/", (req, res) => {
    res.send("Food Delivery Server Running 🚀");
});

// Foods API
app.get("/foods", (req, res) => {
    // __dirname automatically point karega 'backend' folder par, jahan server.js baitha hai
    const foodsPath = path.join(__dirname, "database", "foods.json");

    fs.readFile(foodsPath, "utf8", (err, data) => {
        if (err) {
            console.log("❌ Foods File Read Error:", err);
            res.status(500).send("Error reading food data");
        } else {
            try {
                res.json(JSON.parse(data || "[]"));
            } catch (parseErr) {
                console.log("❌ Foods JSON Parse Error:", parseErr);
                res.status(500).send("Error parsing food data");
            }
        }
    });
});

// Restaurants API
app.get("/restaurants", (req, res) => {
    // path.join bina kisi break ke perfect path resolve karega
    const restaurantPath = path.join(__dirname, "database", "restaurant.json");

    fs.readFile(restaurantPath, "utf8", (err, data) => {
        if (err) {
            console.log("❌ Restaurant File Read Error:", err);
            res.status(500).send("Error reading restaurant data");
        } else {
            try {
                res.json(JSON.parse(data || "[]"));
            } catch (parseErr) {
                console.log("❌ Restaurant JSON Parse Error:", parseErr);
                res.status(500).send("Error parsing restaurant data");
            }
        }
    });
});

// ==========================================
// 3. NAYE MODULES KE ROUTES (INTEGRATION)
// ==========================================

const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/orders");
const deliveryRoutes = require("./routes/delivery");

// Paths mapped accurately according to folder configuration
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);

// ==========================================
// 4. SERVER START
// ==========================================
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT} 🔥`);
});