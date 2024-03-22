import { startSession } from "mongoose";
import { APIError } from "./lib/http-error";
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

export const makeTransactionDb = async ({ debitAccountId, creditAccountId, amount }: { debitAccountId: string, creditAccountId: string, amount: number }) => {
    logger.info({ debitAccountId, creditAccountId, amount }, `[SERVICE], Start: Debit and credit transaction`)

    const session = await startSession();
    session.startTransaction();

    try {
        const debitWallet  = await Account.findOne({ accountId: debitAccountId }).exec()

        if (!debitWallet) {
            throw new APIError({
                message: 'Sender account not valid',
                status: 404
            });       
        }

        if (debitWallet.balance < amount) {
            throw new APIError({
                message: 'Insufficient balance',
                status: 400
            });   
        }

        const debitAccount = await updateWalletBalance({ amount: -amount, accountId: debitAccountId })

        const creditAccount = await upsertWalletBalance({ amount, accountId: creditAccountId })

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

export const debitWalletDb = async ({ accountId, amount }: { accountId: string, amount: number }) => {
    logger.info({ accountId, amount }, `[SERVICE], Start: Debit transaction`)

    const session = await startSession();
    session.startTransaction();

    try {
        const wallet = await Account.findOne({ accountId }).exec()

        if (!wallet) {
            throw new APIError({
                message: 'Wallet not found',
                status: 404
            });
        }
        if (wallet.balance < amount) {
            throw new APIError({
                message: 'Insufficient balance',
                status: 400
            });
        }

        wallet.balance -= amount;
        await wallet.save();

        await session.commitTransaction();

        session.endSession();

        logger.info({ accountId, amount }, `[SERVICE], Finished: Debit transaction`)

        return wallet
    } catch (error) {
        logger.error({ accountId, amount }, `[SERVICE], Debit transaction failed`)
        session.endSession();

        throw error
    }
}