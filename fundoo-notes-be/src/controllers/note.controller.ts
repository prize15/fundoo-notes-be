import { Request, Response, NextFunction } from 'express';
import NoteService from '../services/note.service';
import { INote } from '../interfaces/note.interface';
import redisClient from '../config/redis';
import RabbitMQService from '../services/rabbitmq.service';

class NoteController {
  private noteService = new NoteService();

  // Get all notes for a specific user with caching
  public getAllNotes = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const userId = res.locals.user._id;
      const cacheKey = `notes:${userId}`;

      // Check Redis cache for notes data
      const cachedNotes = await redisClient.get(cacheKey);
      if (cachedNotes) {
        return res.status(200).json(JSON.parse(cachedNotes));
      }

      // Fetch notes from database if not cached
      const notes = await this.noteService.getAllNotes(userId);
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(notes)); // Cache for 1 hour

      return res.status(200).json(notes);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get note by ID with caching
  public getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const cacheKey = `note:${noteId}`;

      // Check Redis cache for specific note data
      const cachedNote = await redisClient.get(cacheKey);
      if (cachedNote) {
        return res.status(200).json(JSON.parse(cachedNote));
      }

      // Fetch note from database if not cached
      const note = await this.noteService.getNoteById(noteId);
      if (!note) {
        return res.status(404).json({ code: 404, message: 'Note not found' });
      }

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(note)); // Cache for 1 hour
      return res.status(200).json(note);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Create a new note and publish message to RabbitMQ
  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteData: INote = req.body;
      const newNote = await this.noteService.createNote(noteData);

      // Clear the cache for this user's notes list to ensure consistency
      const userId = res.locals.user._id;
      await redisClient.del(`notes:${userId}`);

       // Send the new note data to RabbitMQ
       const message = JSON.stringify({ action: 'create_note', data: newNote });
       await RabbitMQService.sendMessage(message); // Updated to sendMessage

       return res.status(201).json(newNote);
   } catch (error) {
       next(error);
       return res.status(500).json({ message: 'Internal server error' });
   }
}


  // Update a note and clear relevant cache
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const updatedNote = await this.noteService.updateNote(noteId, req.body);

      // Clear cache for this note and for the user's notes list
      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Delete a note and clear relevant cache
  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      await this.noteService.deleteNote(noteId);

      // Clear cache for this note and for the user's notes list
      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json({ message: 'Note moved to trash successfully' });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Archive a note and clear relevant cache
  public archiveNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const archivedNote = await this.noteService.archiveNote(noteId);

      // Clear cache for this note and for the user's notes list
      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json(archivedNote);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Unarchive a note and clear relevant cache
  public unarchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const noteId = req.params.noteId;
      const unarchivedNote = await this.noteService.unarchiveNote(noteId);

      // Clear cache for this note and for the user's notes list
      const userId = res.locals.user._id;
      await redisClient.del(`note:${noteId}`);
      await redisClient.del(`notes:${userId}`);

      return res.status(200).json(unarchivedNote);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default NoteController;
