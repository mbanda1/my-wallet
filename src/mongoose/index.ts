import { connect, connection } from 'mongoose';
import logger from '../logger';

export const dbConnect = () =>
    connect('mongodb://127.0.0.1:27017/wallet').
        catch(error => logger.error(error));

connection.on('connected', () => logger.info('DB connected'));

connection.on('disconnected', () => logger.info('DB disconnected'));

connection.on('error', err => {
    logger.error(err)
});

  async function runMigration() {
    try {
      await dbConnect();
    } catch (error) {
      logger.error(error, 'Migration error:');
      process.exit(1);
    }
  }
  

export default runMigration

