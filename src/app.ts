import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';
import { appConfiguration, AppDataSource } from './config';
import { loggerConfiguration } from './utils';
import bodyParser from 'body-parser';

const { ENV_PORT } = appConfiguration;

const initializeServer = async (): Promise<void> => {
  try {
    // Create the Express application
    const app: Application = express();

    // Middleware for parsing JSON request body
    app.use(bodyParser.json({ limit: '500mb' }));

    app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));

    app.use(express.json({ limit: '500mb' }));

    // Middleware for parsing urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // Middleware to enable CORS
    app.use(cors());

    // Enable CORS preflight for all routes
    app.options('*', cors());

    // 404 handler for unknown API requests
    app.use((req: Request, res: Response, next: NextFunction) => {
      next({ statusCode: NOT_FOUND, message: 'Not found' });
    });

    //database connection
    await AppDataSource.initialize()
      .then(() => loggerConfiguration.info('database connection successfully'))
      .catch((err) => loggerConfiguration.info(`error in database connection ${err}`));

    // Start the server
    const server = app.listen(ENV_PORT, () => {
      loggerConfiguration.info(`Listening on port ${ENV_PORT}...`);
    });

    // Graceful server shutdown
    const exitHandler = (): void => {
      server.close(() => {
        loggerConfiguration.info('Server closed');

        process.exit(0);
      });
    };

    // Handle uncaught exceptions and unhandled rejections
    const unexpectedErrorHandler = (error: Error): void => {
      loggerConfiguration.error('error', error);

      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);

    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error) {
    loggerConfiguration.error('Failed to start server:', error);

    process.exit(1);
  }
};

// Start the server
void initializeServer();
