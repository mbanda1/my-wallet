import { connect, connection } from 'mongoose';
import { DB_URI } from '../../config';
import logger from '../logger';

export const dbConnect = (): Promise<void | typeof import("mongoose")> =>
    connect(DB_URI)
     .catch(error => logger.error(error));

connection.on('connected', () => logger.info('DB connected'));

connection.on('disconnected', () => logger.info('DB disconnected'));

connection.on('error', err => {
    logger.error(err)
});

  async function runMigration(): Promise<void> {
    try {
      await dbConnect();
    } catch (error) {
      logger.error(error, 'Migration error:');
      process.exit(1);
    }
  }
  

export default runMigration

