import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import tableRouter from "./routes/table.route.js";
import { seedAdmin } from "./controllers/auth.controller.js";

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
}));

app.use(express.json());

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB ulandi");

        // Seed static admin
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server ishga tushdi: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`DB ulanish xatoligi: ${error}`);
    }
};

startServer();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tables", tableRouter);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server xatoligi" });
});