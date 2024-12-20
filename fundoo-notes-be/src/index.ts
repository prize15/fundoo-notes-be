import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';
import Database from './config/database';
import ErrorHandler from './middlewares/error.middleware';
import Logger from './config/logger';
import morgan from 'morgan';

// Import the RabbitMQ service
import RabbitMQService from './services/rabbitmq.service';

class App {
  public app: Application;
  public host: string | number;
  public port: string | number;
  public api_version: string | number;
  public env: boolean = false;
  private db = new Database();
  private logStream = Logger.logStream;
  private logger = Logger.logger;
  public errorHandler = new ErrorHandler();

  constructor() {
    this.app = express();
    this.host = process.env.APP_HOST as string;
    this.port = process.env.APP_PORT as string;
    this.api_version = process.env.API_VERSION as string;

    this.initializeMiddleWares();
    this.initializeRoutes();
    this.initializeDatabase();
    this.initializeRabbitMQ();  // Initialize RabbitMQ
    this.initializeErrorHandlers();

    // Only start the server if we are not in a test environment
    if (process.env.NODE_ENV !== 'test') {
      this.startApp();
    }
  }

  public initializeMiddleWares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan('combined', { stream: this.logStream }));
  }

  public initializeDatabase(): void {
    this.db.initializeDatabase();
  }

  // Initialize RabbitMQ connection
  public async initializeRabbitMQ(): Promise<void> {
    try {
      await RabbitMQService.connect();
      this.logger.info('RabbitMQ connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
    }
  }

  public initializeRoutes(): void {
    this.app.use(`/api/${this.api_version}`, routes());
  }

  public initializeErrorHandlers(): void {
    this.app.use(this.errorHandler.appErrorHandler);
    this.app.use(this.errorHandler.genericErrorHandler);
    this.app.use(this.errorHandler.notFound);
  }

  public startApp(): void {
    this.app.listen(this.port, () => {
      this.logger.info(
        `Server started at ${this.host}:${this.port}/api/${this.api_version}/`
      );
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// Create an instance of the app
const app = new App();

// Export the app instance for testing purposes
export default app.getApp();
