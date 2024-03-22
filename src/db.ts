import { startSession } from "mongoose";
import logger from "./logger";
import { Account, User } from "./mongoose/models";

export const upsertWalletBalance = async ({ amount, accountId }: { amount: Number, accountId: string }) => {
    logger.info({ amount, accountId }, `[SERVICE], Upsert Balance`)

    return await Account.findOneAndUpdate(
        { accountId: accountId },
        { $inc: { balance: amount } },
        {
            new: true,
            upsert: true,
        }
    );
}

export const updateWalletBalance = ({ amount, accountId }: { amount: Number, accountId: string }) => {
    logger.info({ amount, accountId }, `[SERVICE], Updating Balance`)

    return Account.findOneAndUpdate(
        { accountId: accountId },
        { $inc: { balance: amount } },
        { new: true }
    );
}

export const getWalletByUserId = ({ accountId }: { accountId: string }) => Account.findOne({ accountId }).exec()

export const getUserById = ({ id }: { id: string }) => User.findById(id) 

export const makeTransaction = async ({ debitAccountId, creditAccountId, amount }: { debitAccountId: string, creditAccountId: string, amount: number }) => {
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