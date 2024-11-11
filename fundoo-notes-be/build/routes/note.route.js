"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_controller_1 = __importDefault(require("../controllers/note.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware"); // If you need authentication
class NoteRoutes {
    constructor() {
        this.noteController = new note_controller_1.default();
        this.router = express_1.default.Router();
        this.routes = () => {
            // Get all notes for a user
            this.router.get('', auth_middleware_1.userAuth, this.noteController.getAllNotes);
            // Route to get a note by ID
            this.router.get('/:_id', auth_middleware_1.userAuth, this.noteController.getNoteById);
            // Create a new note
            this.router.post('', auth_middleware_1.userAuth, this.noteController.createNote);
            // Update a note
            this.router.put('/:noteId', auth_middleware_1.userAuth, this.noteController.updateNote);
            // Delete (trash) a note
            this.router.delete('/:noteId', auth_middleware_1.userAuth, this.noteController.deleteNote);
            // Archive a note
            this.router.patch('/:noteId/archive', auth_middleware_1.userAuth, this.noteController.archiveNote);
            // Unarchive a note
            this.router.patch('/:noteId/unarchive', auth_middleware_1.userAuth, this.noteController.unarchiveNote);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = NoteRoutes;
