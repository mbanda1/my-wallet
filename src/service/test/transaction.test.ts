// @ts-nocheck
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import { makeTransactionDb } from '../../db';
import { APIError } from '../../lib/http-error';
import logger from "../../logger";
import { sendMoney } from '../transaction';
import { findUserById } from '../user';
import { findWalletByUserId } from "../wallet";

jest.mock("../../logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

jest.mock("../user", () => ({
    findUserById: jest.fn(),
}));

jest.mock("../wallet", () => ({
    findWalletByUserId: jest.fn(),
}));

jest.mock("../../db", () => ({
    makeTransactionDb: jest.fn(),
}));

describe("[TEST] Make a transfer", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {} as Request;
        res = ({
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        }) as unknown as Response;
        next = jest.fn();
    });


    it("should log start of send transaction", async () => {
        await sendMoney()(req, res, next);
        expect(logger.info).toHaveBeenCalledWith("[SERVICE], Start send transaction");
    });


    it("should return 404 if receiver account does not exist", async () => {
        const creditAccountId = "receiverAccountId";
        (findUserById as jest.Mock).mockResolvedValueOnce(null);
        req.body = { creditAccountId, debitAccountId: "debitAccountId", amount: 100 };

        await sendMoney()(req, res, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Receiver account not valid");
    });

    it('should return 404 if sender account is not valid', async () => {
        const debitAccountId = 'invalidAccountId';
        const creditAccountId = 'receiverAccountId';
        const amount = 100;
        (findUserById as jest.Mock).mockResolvedValueOnce({}); // Assuming sender account exists
     
        (makeTransactionDb as jest.Mock).mockImplementationOnce(async () => {
            throw new APIError({
                message: 'Sender account not valid',
                status: 404
            });
          });
        req.body = { debitAccountId, creditAccountId, amount };
    
        await sendMoney()(req, res, next);
    
        expect(logger.error).toHaveBeenCalledWith(
          '[SERVICE], Send transaction failed'
        );
      });

    it("should make transaction and return the transaction object", async () => {
        const debitAccountId = "senderAccountId";
        const creditAccountId = "receiverAccountId";
        const amount = 100;
        const mockTransaction = { id: "transactionId", amount, debitAccountId, creditAccountId };
        (findUserById as jest.Mock).mockResolvedValueOnce({});
        (findWalletByUserId as jest.Mock).mockResolvedValueOnce({ balance: 200 });
        (makeTransactionDb as jest.Mock).mockResolvedValueOnce(mockTransaction);
        req.body = { creditAccountId, debitAccountId, amount };

        await sendMoney()(req, res, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockTransaction);
        expect(logger.info).toHaveBeenCalledWith("[SERVICE], End send transaction");
    });
})