import { connect, connection } from 'mongoose';
import { Account, User } from './models';

export const dbConnect = () =>
    connect('mongodb://127.0.0.1:27017/wallet').
        catch(error => console.log(error));

connection.on('connected', () => console.log('DB connected'));

connection.on('disconnected', () => console.log('DB disconnected'));

connection.on('error', err => {
    console.log(err);
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
          console.log(`${name} model created`);
        }
      }
      console.log('Migration upto date');
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  async function runMigration() {
    try {
      await dbConnect();
      await createModelsIfNotExist();
    } catch (error) {
      console.error('Migration error:', error);
      process.exit(1);
    }
  }
  

export default runMigration

