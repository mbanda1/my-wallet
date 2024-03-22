import { NextFunction, Request, Response } from 'express';
import { getWalletByUserId, upsertWalletBalance } from '../db';
import logger from '../logger';
import { findUserById } from './user';

export const findWalletByUserId = async ({ account }: { account: string }) => {
    logger.info({account}, `[SERVICE], Get wallet by used id`)
    
    return getWalletByUserId({ accountId: account })
}

export const creditWallet = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('[SERVICE], Start credit operation')

        const checkAccount = await findUserById({ id: req.body.accountId })

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
