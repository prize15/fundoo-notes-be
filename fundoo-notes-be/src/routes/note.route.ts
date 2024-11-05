import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware'; // If you need authentication

class NoteRoutes {
  private noteController = new NoteController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Get all notes for a user
    this.router.get('/:userId', userAuth, this.noteController.getAllNotes);

    // Create a new note
    this.router.post('', userAuth, this.noteController.createNote);

    // Update a note
    this.router.put('/:noteId', userAuth, this.noteController.updateNote);

    // Delete (trash) a note
    this.router.delete('/:noteId', userAuth, this.noteController.deleteNote);

    // Archive a note
    this.router.patch('/:noteId/archive', userAuth, this.noteController.archiveNote);

    // Unarchive a note
    this.router.patch('/:noteId/unarchive', userAuth, this.noteController.unarchiveNote);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
