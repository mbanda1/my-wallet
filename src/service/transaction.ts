import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { startSession } from 'mongoose';
import logger from '../logger';
import { getUserById } from './user';
import { getWalletByUserId, updateWalletBalance } from './wallet';

export const sendMoney = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`[SERVICE], Start send transaction`)

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const debitAccountId = req.body.debitAccountId
        const creditAccountId = req.body.creditAccountId
        const amount = req.body.amount

        const getReceiver = await getUserById({ id: creditAccountId })
        if (!getReceiver) {
            return res.status(404).send('Receiver account not valid');
        }

        const debitAccount = await getWalletByUserId({ account: debitAccountId })
        if (!debitAccount) {
            return res.status(404).send('Sender account not valid');
        }


        if (debitAccount.balance >= amount) {
            const transaction = await transact({
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

const transact = async ({ debitAccountId, creditAccountId, amount }: { debitAccountId: string, creditAccountId: string, amount: number }) => {
    logger.info({ debitAccountId, creditAccountId, amount }, `[SERVICE], Start: Debit and credit transaction`)
    
    const session = await startSession();
    session.startTransaction();

    try {
        const debitAccount = await updateWalletBalance({ amount: -amount, accountId: debitAccountId })
           
        const creditAccount = await updateWalletBalance({ amount, accountId: creditAccountId })

        await session.commitTransaction();

        session.endSession();

       logger.info({ debitAccountId, creditAccountId, amount }, `[SERVICE], Finished: Debit and credit transaction`)

        return { debitAccount, creditAccount };
    } catch (error) {
        logger.error({ debitAccountId, creditAccountId, amount }, `[SERVICE], Debit and credit transaction failed`)
        session.endSession();

        throw error;
    }
}