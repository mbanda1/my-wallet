import { NextFunction, Request, Response } from 'express';
import { makeTransaction } from '../db';
import logger from '../logger';
import { findUserById } from './user';
import { findWalletByUserId } from './wallet';

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

        const debitAccount = await findWalletByUserId({ account: debitAccountId })
        if (!debitAccount) {
            return res.status(404).send('Sender account not valid');
        }


        if (debitAccount.balance >= amount) {
            const transaction = await makeTransaction({
                debitAccountId,
                creditAccountId,
                amount,
            })
            res.status(201).json(transaction);

        } else {
            return res.status(404).send('Insufficient balance');
        }
        logger.info(`[SERVICE], End send transaction`)
    } catch (error) {
        logger.error(`[SERVICE], Send transaction failed`)
        next(error);
    }
}