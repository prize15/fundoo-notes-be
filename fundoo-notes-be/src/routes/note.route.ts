import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';

class NoteRoutes {
  private noteController = new NoteController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Get all notes for a user
    this.router.get('/', userAuth, this.noteController.getAllNotes);

    // Get a specific note by ID
    this.router.get('/:_id', userAuth, this.noteController.getNoteById);

    // Create a new note
    this.router.post('/', userAuth, this.noteController.createNote);

    // Update a note (title, content, or other properties)
    this.router.put('/:noteId', userAuth, this.noteController.updateNote);

    // Move a note to trash (or restore from trash)
    this.router.put('/:noteId/trash', userAuth, this.noteController.toggleTrash);

    // Archive a note
    this.router.put('/:noteId/archive', userAuth, this.noteController.toggleArchive);

    // Delete a note permanently
    this.router.delete('/:noteId', userAuth, this.noteController.deleteNote);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
