import Note from '../models/note.model';
import { INote } from '../interfaces/note.interface';

class NoteService {
  // Get all notes for a specific user
  public getAllNotes = async (userId: string): Promise<INote[]> => {
    return await Note.find({ userId, isTrashed: false }); // Only fetch notes that are not trashed
  };

  // Create a new note
  public createNote = async (noteData: INote): Promise<INote> => {
    return await Note.create(noteData);
  };

  // Update a note
  public updateNote = async (noteId: string, noteData: Partial<INote>): Promise<INote | null> => {
    return await Note.findByIdAndUpdate(noteId, noteData, { new: true });
  };

  // Delete a note (soft delete)
  public deleteNote = async (noteId: string): Promise<void> => {
    await Note.findByIdAndUpdate(noteId, { isTrashed: true });
  };

  // Archive a note
  public archiveNote = async (noteId: string): Promise<INote | null> => {
    return await Note.findByIdAndUpdate(noteId, { isArchived: true }, { new: true });
  };

  // Unarchive a note
  public unarchiveNote = async (noteId: string): Promise<INote | null> => {
    return await Note.findByIdAndUpdate(noteId, { isArchived: false }, { new: true });
  };
}

export default NoteService;
