import { connection } from "mongoose";
import { Account, User } from "./models";
import { connect } from "mongoose";

export const dbConnect = async () =>
    await connect('mongodb://127.0.0.1:27017/wallet')
        .then(() => console.log('Db connected.'))
        .catch(error => console.error(error));

const seedUsers = [
    {
        name: 'Peter ola',
        email: 'peter@gamil.com'
    },
    {
        name: 'John ola',
        email: 'john@gamil.com'
    },
    {
        name: 'James ola',
        email: 'james@gamil.com'
    }
]

const modelsToCreate = [
    { name: 'Users', model: User },
    { name: 'Accounts', model: Account },
  ];

  async function createModelsIfNotExist() {
    try {
      for (const { name, model } of modelsToCreate) {
        if (!connection.models[name]) {
    
          await model.createCollection();
          console.info(`[Model Create] ${name} model created`)
        }
      }
      console.info('Migration models date');
    } catch (error) {
        console.error(error, 'Error during migration:');
      throw error;
    }
  }

const seedDb = async () => {
    await Account.deleteMany()
    await User.deleteMany()
    await User.insertMany(seedUsers)
}

dbConnect().
    then(async () => {
        console.log('Db Models setup')
        await createModelsIfNotExist();
    }).
    then(async () => {
        console.log('Db seeding STARTED')
        await seedDb()
    }).then(() => {
        connection.close()
        console.log('Db seeding COMPLETE')
    })
