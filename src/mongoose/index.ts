import { Schema, model, connect, connection } from 'mongoose';

interface IUser {
    id: Number
    name: string;
    email?: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: false },
});

const User = model<IUser>('User', userSchema);

const dbConnect = () =>
    connect('mongodb://127.0.0.1:27017/wallet').
        catch(error => console.log(error));

connection.on('connected', () => console.log('DB connected'));

connection.on('disconnected', () => console.log('DB disconnected'));

connection.on('error', err => {
    console.log(err);
});

async function initRun() {

    const user = new User({
        name: 'Nixon',
        email: 'test@gmail.com',
    });
    await user.save();

    console.log(user.email);
}

initRun()

export default dbConnect

