"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_model_1 = __importDefault(require("../models/note.model"));
class NoteService {
    constructor() {
        // Get all notes for a specific user
        this.getAllNotes = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield note_model_1.default.find({ userId, isTrashed: false }); // Only fetch notes that are not trashed
        });
        // Create a new note
        this.createNote = (noteData) => __awaiter(this, void 0, void 0, function* () {
            return yield note_model_1.default.create(noteData);
        });
        // Get Note by ID
        this.getNoteById = (noteId) => __awaiter(this, void 0, void 0, function* () {
            return yield note_model_1.default.findById(noteId);
        });
        // Update a note
        this.updateNote = (noteId, noteData) => __awaiter(this, void 0, void 0, function* () {
            return yield note_model_1.default.findByIdAndUpdate(noteId, noteData, { new: true });
        });
        // Delete a note (soft delete)
        this.deleteNote = (noteId) => __awaiter(this, void 0, void 0, function* () {
            yield note_model_1.default.findByIdAndUpdate(noteId, { isTrashed: true });
        });
        // Archive a note
        this.archiveNote = (noteId) => __awaiter(this, void 0, void 0, function* () {
            return yield note_model_1.default.findByIdAndUpdate(noteId, { isArchived: true }, { new: true });
        });
        // Unarchive a note
        this.unarchiveNote = (noteId) => __awaiter(this, void 0, void 0, function* () {
            return yield note_model_1.default.findByIdAndUpdate(noteId, { isArchived: false }, { new: true });
        });
    }
}
exports.default = NoteService;
