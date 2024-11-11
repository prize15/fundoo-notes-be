import { Request, Response, NextFunction } from 'express';
import NoteService from '../services/note.service';
import { INote } from '../interfaces/note.interface';

class NoteController {
  private noteService = new NoteService();

  // Get all notes for a specific user
  public getAllNotes = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      console.log("User authenticated, fetching notes...");
      const userId = res.locals.user._id;
      const notes = await this.noteService.getAllNotes(userId);
      console.log("Notes fetched successfully:", notes);
      return res.status(200).json(notes);  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };

  // Get note by note ID
  public getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params._id;
      const note = await this.noteService.getNoteById(noteId);
      if (!note) {
        return res.status(404).json({ code: 404, message: 'Note not found' });
      }
      return res.status(200).json(note);  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };

  // Create a new note
  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteData: INote = req.body;
      const newNote = await this.noteService.createNote(noteData);
      return res.status(201).json(newNote);  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };

  // Update a note
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const updatedNote = await this.noteService.updateNote(noteId, req.body);
      return res.status(200).json(updatedNote);  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };

  // Delete a note
  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      await this.noteService.deleteNote(noteId);
      return res.status(200).json({ message: 'Note moved to trash successfully' });  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };

  // Archive a note
  public archiveNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const archivedNote = await this.noteService.archiveNote(noteId);
      return res.status(200).json(archivedNote);  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };

  // Unarchive a note
  public unarchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const unarchivedNote = await this.noteService.unarchiveNote(noteId);
      return res.status(200).json(unarchivedNote);  // Ensure returning the response object
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });  // In case the error isn't handled by the error handler
    }
  };
}

export default NoteController;
