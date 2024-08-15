import { connect, connection, Model } from "mongoose";
import { DB_URI } from "../../config";
import { Account, IUser, User } from "./models";

// Function to connect to the database
export const dbConnect = async (): Promise<void> => {
    await connect(DB_URI)
        .then(() => console.log('Db connected.'))
        .catch(error => console.error(error));
};

// Seed user data array with IUser type
const seedUsers: Pick<IUser, 'name' | 'email' | 'createdAt'>[] = [
    {
        name: 'Peter ola',
        email: 'peter@gamil.com',
        createdAt: new Date()
    },
    {
        name: 'John ola',
        email: 'john@gamil.com',
        createdAt: new Date()
    },
    {
        name: 'James ola',
        email: 'james@gamil.com',
        createdAt: new Date()
    }
];

// Generic interface for models to create
interface ModelToCreate {
    name: string;
    model: Model<any>;
}

// Array of models to create if they don't exist, with specific types
const modelsToCreate: ModelToCreate[] = [
    { name: 'Users', model: User },
    { name: 'Accounts', model: Account },
];

// Function to create models if they don't exist
async function createModelsIfNotExist(): Promise<void> {
    try {
        for (const { name, model } of modelsToCreate) {
            if (!connection.models[name]) {
                await model.createCollection();
                console.info(`[Model Create] ${name} model created`);
            }
        }
        console.info('Migration models done');
    } catch (error) {
        console.error(error, 'Error during migration:');
        throw error;
    }
}

// Function to seed the database
const seedDb = async (): Promise<void> => {
    await Account.deleteMany();
    await User.deleteMany();
    await User.insertMany(seedUsers);
};

// Main function to set up DB models and seed the DB
dbConnect()
    .then(async () => {
        console.log('Db Models setup');
        await createModelsIfNotExist();
    })
    .then(async () => {
        console.log('Db seeding STARTED');
        await seedDb();
    })
    .then(() => {
        connection.close();
        console.log('Db seeding COMPLETE');
    });
