import { Request, Response, NextFunction } from 'express';
import NoteService from '../services/note.service';
import { INote } from '../interfaces/note.interface';

class NoteController {
  private noteService = new NoteService();

  // Get all notes for a specific user
  public getAllNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId; // Assume userId is passed as a route parameter
      const notes = await this.noteService.getAllNotes(userId);
      res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  };

  // Create a new note
  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteData: INote = req.body;
      const newNote = await this.noteService.createNote(noteData);
      res.status(201).json(newNote);
    } catch (error) {
      next(error);
    }
  };

  // Update a note
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.noteId;
      const updatedNote = await this.noteService.updateNote(noteId, req.body);
      res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
    }
  };

  // Delete a note
  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.noteId;
      await this.noteService.deleteNote(noteId);
      res.status(200).json({ message: 'Note moved to trash successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Archive a note
  public archiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.noteId;
      const archivedNote = await this.noteService.archiveNote(noteId);
      res.status(200).json(archivedNote);
    } catch (error) {
      next(error);
    }
  };

  // Unarchive a note
  public unarchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.noteId;
      const unarchivedNote = await this.noteService.unarchiveNote(noteId);
      res.status(200).json(unarchivedNote);
    } catch (error) {
      next(error);
    }
  };
}

export default NoteController;
