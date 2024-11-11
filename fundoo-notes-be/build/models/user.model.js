"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures that email is unique
        lowercase: true // Convert to lowercase for case-insensitive matching
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('User', userSchema);
