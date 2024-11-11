"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    /* userId: {
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true,
     },*/
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    isTrashed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Note', noteSchema);
