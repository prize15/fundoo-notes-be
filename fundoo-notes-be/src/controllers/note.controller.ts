import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import NoteService from '../services/note.service';
import { INote } from '../interfaces/note.interface';
import redisClient from '../config/redis';
import RabbitMQService from '../services/rabbitmq.service';

class NoteController {
  private noteService = new NoteService();

  // Validate ObjectId
  private validateNoteId = (noteId: string): boolean => {
    return mongoose.Types.ObjectId.isValid(noteId);
  };

  // Get all notes for a specific user with caching
  public getAllNotes = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const userId = res.locals.user._id;
      const cacheKey = `notes:${userId}`;

      const cachedNotes = await redisClient.get(cacheKey);
      if (cachedNotes) {
        return res.status(200).json(JSON.parse(cachedNotes));
      }

      const notes = await this.noteService.getAllNotes(userId);
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(notes)); // Cache for 1 hour
      return res.status(200).json(notes);
    } catch (error) {
      next(error);
      return; // Return undefined to satisfy TypeScript's expectations
    }
  };

  // Get note by ID with caching
  public getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const noteId = req.params.noteId;

      if (!this.validateNoteId(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }

      const cacheKey = `note:${noteId}`;
      const cachedNote = await redisClient.get(cacheKey);
      if (cachedNote) {
        return res.status(200).json(JSON.parse(cachedNote));
      }

      const note = await this.noteService.getNoteById(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(note));
      return res.status(200).json(note);
    } catch (error) {
      next(error);
      return; // Return undefined
    }
  };

  // Create a new note and publish message to RabbitMQ
  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const noteData: INote = req.body;
      const newNote = await this.noteService.createNote(noteData);

      const userId = res.locals.user._id;
      await redisClient.del(`notes:${userId}`);

      const message = JSON.stringify({ action: 'create_note', data: newNote });
      await RabbitMQService.sendMessage(message);

      return res.status(201).json(newNote);
    } catch (error) {
      next(error);
      return; // Return undefined
    }
  };

  // Update a note and clear relevant cache
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const noteId = req.params.noteId;

      if (!this.validateNoteId(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }

      const updatedNote = await this.noteService.updateNote(noteId, req.body);

      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
      return; // Return undefined
    }
  };

  // Move a note to trash or restore it from trash
  public toggleTrash = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const noteId = req.params.noteId;
      const { isTrashed } = req.body;

      if (!this.validateNoteId(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }

      const updatedNote = await this.noteService.toggleTrash(noteId, isTrashed);

      if (!updatedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
      return; // Return undefined
    }
  };

  // Toggle archive status of a note
  public toggleArchive = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const noteId = req.params.noteId;
      const { isArchived } = req.body;

      if (!this.validateNoteId(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }

      const updatedNote = await this.noteService.toggleArchive(noteId, isArchived);

      if (!updatedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
      return; // Return undefined
    }
  };

  // Permanently delete a note and clear relevant cache
  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const noteId = req.params.noteId;

      if (!this.validateNoteId(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }

      await this.noteService.deleteNote(noteId);

      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      next(error);
      return; // Return undefined
    }
  };
}

export default NoteController;
