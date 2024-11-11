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
const note_service_1 = __importDefault(require("../services/note.service"));
class NoteController {
    constructor() {
        this.noteService = new note_service_1.default();
        // Get all notes for a specific user
        this.getAllNotes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("User authenticated, fetching notes...");
                const userId = res.locals.user._id;
                const notes = yield this.noteService.getAllNotes(userId);
                console.log("Notes fetched successfully:", notes);
                res.status(200).json(notes);
            }
            catch (error) {
                next(error);
            }
        });
        // Get note by note ID
        this.getNoteById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params._id;
                const note = yield this.noteService.getNoteById(noteId);
                if (!note) {
                    return res.status(404).json({ code: 404, message: 'Note not found' });
                }
                res.status(200).json(note);
            }
            catch (error) {
                next(error);
            }
        });
        // Create a new note
        this.createNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteData = req.body;
                const newNote = yield this.noteService.createNote(noteData);
                res.status(201).json(newNote);
            }
            catch (error) {
                next(error);
            }
        });
        // Update a note
        this.updateNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.noteId;
                const updatedNote = yield this.noteService.updateNote(noteId, req.body);
                res.status(200).json(updatedNote);
            }
            catch (error) {
                next(error);
            }
        });
        // Delete a note
        this.deleteNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.noteId;
                yield this.noteService.deleteNote(noteId);
                res.status(200).json({ message: 'Note moved to trash successfully' });
            }
            catch (error) {
                next(error);
            }
        });
        // Archive a note
        this.archiveNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.noteId;
                const archivedNote = yield this.noteService.archiveNote(noteId);
                res.status(200).json(archivedNote);
            }
            catch (error) {
                next(error);
            }
        });
        // Unarchive a note
        this.unarchiveNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.noteId;
                const unarchivedNote = yield this.noteService.unarchiveNote(noteId);
                res.status(200).json(unarchivedNote);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = NoteController;
