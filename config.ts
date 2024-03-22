require('dotenv').config();

export const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/wallet';
export const PORT = process.env.PORT || 3001;
