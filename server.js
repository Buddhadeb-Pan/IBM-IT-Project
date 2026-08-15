import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "AI Chatbot Backend is running"
    });
});
app.get("/test", (req, res) => {
    res.json({
        message: "Test route is working"
    });
});


// =========================
// AUTH ROUTES
// =========================

app.use(
    "/api/auth",
    authRoutes
);
app.get("/api/auth-direct-test", (req, res) => {
    res.json({
        message: "Direct auth test is working"
    });
});


// =========================
// SERVER
// =========================

const PORT =
    process.env.PORT || 5000;

console.log("AUTH ROUTES LOADED");
app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );
});