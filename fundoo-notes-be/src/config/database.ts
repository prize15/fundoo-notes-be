import mongoose from 'mongoose';
import Logger from './logger';

class Database {
  private DATABASE: string;
  private logger;

  constructor() {
    // Ensure DATABASE_URL is always defined
    if (process.env.NODE_ENV === 'test') {
      this.DATABASE = process.env.DATABASE_TEST!;
      if (!this.DATABASE) {
        throw new Error('DATABASE_TEST environment variable is missing!');
      }
    } else {
      this.DATABASE = process.env.DATABASE!;
      if (!this.DATABASE) {
        throw new Error('DATABASE environment variable is missing!');
      }
    }

    this.logger = Logger.logger;
  }

  public initializeDatabase = async (): Promise<void> => {
    try {
      await mongoose.connect(this.DATABASE, {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      this.logger.info('Connected to the database.');
    } catch (error) {
      this.logger.error('Could not connect to the database.', error);
    }
  };
}

export default Database;
