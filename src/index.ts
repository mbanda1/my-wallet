import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from "express";
import { PORT } from '../config';
import logger from './logger';
import mongooseDb from "./mongoose";
import transactionRoutes from './routes//transaction';
import walletRoutes from './routes/wallet';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api/wallet', walletRoutes);
app.use('/api/transaction', transactionRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Live server");
});

mongooseDb()

// error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error((err.stack))
  res.status(500).send(err.message || 'Something went wrong');
});

app.listen(PORT, () => {
  logger.info(`[server]: Server is running at ${PORT}`);
});