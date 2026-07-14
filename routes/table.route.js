import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    getAllTables,
    createTable,
    getTableById,
    deleteTable,
    regenerateTableId,
    updateTableName,
    updateFullTable,
    addRole,
    deleteRole,
    createRow,
    updateRow,
    deleteRow,
    addTask,
    updateTask,
    deleteTask,
} from "../controllers/table.controller.js";

const router = express.Router();

// Public routes (user view)
router.get("/public/:tableId", getTableById);

// Admin routes (protected)
router.get("/", authMiddleware, getAllTables);
router.post("/", authMiddleware, createTable);
router.get("/:tableId", authMiddleware, getTableById);
router.delete("/:tableId", authMiddleware, deleteTable);
router.patch("/:tableId/regenerate", authMiddleware, regenerateTableId);
router.patch("/:tableId/name", authMiddleware, updateTableName);
router.put("/:tableId", authMiddleware, updateFullTable);

// Roles
router.post("/:tableId/roles", authMiddleware, addRole);
router.delete("/:tableId/roles/:roleIndex", authMiddleware, deleteRole);

// Rows
router.post("/:tableId/rows", authMiddleware, createRow);
router.patch("/:tableId/rows/:rowId", authMiddleware, updateRow);
router.delete("/:tableId/rows/:rowId", authMiddleware, deleteRow);

// Tasks
router.post("/:tableId/rows/:rowId/tasks", authMiddleware, addTask);
router.patch("/:tableId/rows/:rowId/tasks/:taskId", authMiddleware, updateTask);
router.delete("/:tableId/rows/:rowId/tasks/:taskId", authMiddleware, deleteTask);

export default router;
