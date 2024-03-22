import { connect, connection } from 'mongoose';
import logger from '../logger';
import { Account, User } from './models';

export const dbConnect = () =>
    connect('mongodb://127.0.0.1:27017/wallet').
        catch(error => logger.error(error));

connection.on('connected', () => logger.info('DB connected'));

connection.on('disconnected', () => logger.info('DB disconnected'));

connection.on('error', err => {
    logger.error(err)
});


const modelsToCreate = [
    { name: 'Users', model: User },
    { name: 'Accounts', model: Account },
  ];

  async function createModelsIfNotExist() {
    try {
      for (const { name, model } of modelsToCreate) {
        if (!connection.models[name]) {
    
          await model.createCollection();
          logger.info(`[Model Create] ${name} model created`)
        }
      }
      logger.info('Migration upto date');
    } catch (error) {
      logger.error(error, 'Error during migration:');
      throw error;
    }
  }

  async function runMigration() {
    try {
      await dbConnect();
      await createModelsIfNotExist();
    } catch (error) {
      logger.error(error, 'Migration error:');
      process.exit(1);
    }
  }
  

export default runMigration

