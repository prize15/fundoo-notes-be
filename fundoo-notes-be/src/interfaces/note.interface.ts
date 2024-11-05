import { Document } from 'mongoose';

export interface INote extends Document {
  userId: string;
  title: string;
  content: string;
  isArchived: boolean;
  isTrashed: boolean;
}
