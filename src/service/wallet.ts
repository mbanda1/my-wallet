import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import logger from '../logger';
import { Account } from '../mongoose/models';
import { getUserById } from './user';

export const getWalletByUserId = async ({ account }: { account: string }) => {
    logger.info({account}, `[SERVICE], Get wallet by used id`)
    
    return Account.findOne({ accountId: account }).exec()
}

export const creditWallet = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('[SERVICE], Start credit operation')

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkAccount = await getUserById({ id: req.body.accountId })

        if (!checkAccount) {
            return res.status(404).send('Account not valid');
        }

        const upsertWallet = await upsertWalletBalance({ amount: req.body.amount, accountId: req.body.accountId })

        res.status(201).json(upsertWallet);
        logger.info('[SERVICE], End credit operation')
    } catch (error) {
        logger.error('[SERVICE], Credit operation failed')
        next(error);
    }
}


export const upsertWalletBalance = async ({ amount, accountId }: { amount: Number, accountId: string }) => {
    logger.info({ amount, accountId }, `[SERVICE], Upsert Balance`)

    const update = { $inc: { balance: amount } }
    const filter = { accountId: accountId }

    return await Account.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
    });
}

export const updateWalletBalance = ({ amount, accountId }: { amount: Number, accountId: string }) => {
    logger.info({ amount, accountId }, `[SERVICE], Updating Balance`)

    return Account.findOneAndUpdate(
        { accountId: accountId },
        { $inc: { balance: amount } },
        { new: true }
    );
}