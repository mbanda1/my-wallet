import { NextFunction, Request, Response } from 'express';
import { makeTransactionDb } from '../db';
import logger from '../logger';
import { findUserById } from './user';

export const sendMoney = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`[SERVICE], Start send transaction`)

        const debitAccountId = req.body.debitAccountId
        const creditAccountId = req.body.creditAccountId
        const amount = req.body.amount

        const getReceiver = await findUserById({ id: creditAccountId })
        if (!getReceiver) {
            return res.status(404).send('Receiver account not valid');
        }

        const transaction = await makeTransactionDb({
            debitAccountId,
            creditAccountId,
            amount,
        })
        res.status(201).json(transaction);

        logger.info(`[SERVICE], End send transaction`)
    } catch (error) {
        logger.error(`[SERVICE], Send transaction failed`)
        next(error);
    }
}