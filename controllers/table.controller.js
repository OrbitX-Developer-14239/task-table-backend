import Table from "../models/table.model.js";
import { v4 as uuidv4 } from "uuid";

const TELEGRAM_LINK_PATTERN = /^\[([^\]]+)\]\((tg:\/\/.+|https:\/\/t\.me\/.+)\)$/;

const validateTelegramLinkValue = (value) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!TELEGRAM_LINK_PATTERN.test(trimmed)) {
        return "Noto'g'ri Telegram link formati. Namuna: [text](https://t.me/username) yoki [text](tg://resolve?domain=username)";
    }
    return null;
};

const validateTaskPayload = (rowsPayload) => {
    for (const row of rowsPayload || []) {
        const rowTelegramLinkError = validateTelegramLinkValue(row?.telegramLink);
        if (rowTelegramLinkError) return rowTelegramLinkError;
    }
    return null;
};

// Get all tables
export const getAllTables = async (req, res) => {
    try {
        const tables = await Table.find().select("tableId name createdAt").sort({ createdAt: -1 });
        return res.status(200).json(tables);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Create new table
export const createTable = async (req, res) => {
    try {
        const tableId = uuidv4();
        const table = await Table.create({
            tableId,
            name: req.body.name || "Yangi jadval",
            roles: [],
            rows: [],
        });
        return res.status(201).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Get table by tableId
export const getTableById = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Delete table
export const deleteTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.findOneAndDelete({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json({ message: "Jadval o'chirildi" });
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Regenerate table ID
export const regenerateTableId = async (req, res) => {
    try {
        const { tableId } = req.params;
        const newTableId = uuidv4();
        const table = await Table.findOneAndUpdate(
            { tableId },
            { tableId: newTableId },
            { new: true }
        );
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Update table name
export const updateTableName = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { name } = req.body;
        const table = await Table.findOneAndUpdate(
            { tableId },
            { name },
            { new: true }
        );
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Update hide-names flag for the table
export const updateHideNames = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { hideNames } = req.body;
        const table = await Table.findOneAndUpdate(
            { tableId },
            { hideNames: Boolean(hideNames) },
            { new: true }
        );
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Update full table rows (for bulk save)
export const updateFullTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { rows } = req.body;
        const validationError = validateTaskPayload(rows);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const table = await Table.findOneAndUpdate(
            { tableId },
            { rows },
            { new: true }
        );
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// === ROLES ===

// Add role to table
export const addRole = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ message: "Rol nomi kiritilishi shart" });
        }
        const table = await Table.findOneAndUpdate(
            { tableId },
            { $push: { roles: role } },
            { new: true }
        );
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Delete role from table
export const deleteRole = async (req, res) => {
    try {
        const { tableId, roleIndex } = req.params;
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        table.roles.splice(parseInt(roleIndex), 1);
        await table.save();
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// === ROWS ===

// Create row
export const createRow = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        const newRow = {
            name: req.body.name || "Yangi xodim",
            role: req.body.role || "",
            telegramLink: req.body.telegramLink || "",
            hideName: false,
            tasks: [{
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                delay: "",
            }],
        };
        table.rows.push(newRow);
        await table.save();
        return res.status(201).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Update row
export const updateRow = async (req, res) => {
    try {
        const { tableId, rowId } = req.params;
        const { name, role, hideName, telegramLink } = req.body;
        const validationError = validateTelegramLinkValue(telegramLink);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        const row = table.rows.id(rowId);
        if (!row) {
            return res.status(404).json({ message: "Qator topilmadi" });
        }
        if (name !== undefined) row.name = name;
        if (role !== undefined) row.role = role;
        if (telegramLink !== undefined) row.telegramLink = telegramLink;
        if (hideName !== undefined) row.hideName = Boolean(hideName);
        table.markModified('rows');
        await table.save();
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Delete row
export const deleteRow = async (req, res) => {
    try {
        const { tableId, rowId } = req.params;
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        table.rows.pull({ _id: rowId });
        await table.save();
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// === TASKS ===

// Add task to row
export const addTask = async (req, res) => {
    try {
        const { tableId, rowId } = req.params;
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        const row = table.rows.id(rowId);
        if (!row) {
            return res.status(404).json({ message: "Qator topilmadi" });
        }
        row.tasks.push({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            delay: "",
        });
        await table.save();
        return res.status(201).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const { tableId, rowId, taskId } = req.params;
        const { name, description, startDate, endDate, delay } = req.body;
        // removed validateTelegramLinkValue for task fields
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        const row = table.rows.id(rowId);
        if (!row) {
            return res.status(404).json({ message: "Qator topilmadi" });
        }
        const task = row.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ message: "Vazifa topilmadi" });
        }
        if (name !== undefined) task.name = name;
        if (description !== undefined) task.description = description;
        if (startDate !== undefined) task.startDate = startDate;
        if (endDate !== undefined) task.endDate = endDate;
        if (delay !== undefined) task.delay = delay;
        await table.save();
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const { tableId, rowId, taskId } = req.params;
        const table = await Table.findOne({ tableId });
        if (!table) {
            return res.status(404).json({ message: "Jadval topilmadi" });
        }
        const row = table.rows.id(rowId);
        if (!row) {
            return res.status(404).json({ message: "Qator topilmadi" });
        }
        row.tasks.pull({ _id: taskId });
        await table.save();
        return res.status(200).json(table);
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};
