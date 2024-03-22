// @ts-nocheck
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import { makeTransaction } from '../../db';
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
    makeTransaction: jest.fn(),
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
        }) as Response;
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

    it("should return 404 if sender account does not exist", async () => {
        const debitAccountId = "senderAccountId";
        (findUserById as jest.Mock).mockResolvedValueOnce({});
        (findWalletByUserId as jest.Mock).mockResolvedValueOnce(null);
        req.body = { creditAccountId: "creditAccountId", debitAccountId, amount: 100 };

        await sendMoney()(req, res, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Sender account not valid");
    });


    it("should return 404 if sender account has insufficient balance", async () => {
        const debitAccountId = "senderAccountId";
        const balance = 50;
        const amount = 100;
        (findUserById as jest.Mock).mockResolvedValueOnce({});
        (findWalletByUserId as jest.Mock).mockResolvedValueOnce({ balance });
        req.body = { creditAccountId: "creditAccountId", debitAccountId, amount };

        await sendMoney()(req, res, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Insufficient balance");
    });


    it("should make transaction and return the transaction object", async () => {
        const debitAccountId = "senderAccountId";
        const creditAccountId = "receiverAccountId";
        const amount = 100;
        const mockTransaction = { id: "transactionId", amount, debitAccountId, creditAccountId };
        (findUserById as jest.Mock).mockResolvedValueOnce({});
        (findWalletByUserId as jest.Mock).mockResolvedValueOnce({ balance: 200 });
        (makeTransaction as jest.Mock).mockResolvedValueOnce(mockTransaction);
        req.body = { creditAccountId, debitAccountId, amount };

        await sendMoney()(req, res, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockTransaction);
        expect(logger.info).toHaveBeenCalledWith("[SERVICE], End send transaction");
    });
})