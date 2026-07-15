import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    startDate: {
        type: String,
        default: "",
    },
    endDate: {
        type: String,
        default: "",
    },
    delay: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const rowSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Yangi xodim",
    },
    role: {
        type: String,
        default: "",
    },
    hideName: {
        type: Boolean,
        default: false,
    },
    tasks: [taskSchema],
}, { timestamps: true });

const tableSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: "Yangi jadval",
    },
    roles: [{
        type: String,
    }],
    hideNames: {
        type: Boolean,
        default: false,
    },
    rows: [rowSchema],
}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema);
export default Table;
