// @ts-nocheck
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import { upsertWalletBalance } from '../../db';
import logger from "../../logger";
import { findUserById } from "../user";
import { creditWallet } from "../wallet";

jest.mock("../../logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

jest.mock("express-validator", () => ({
    validationResult: jest.fn(),
}));

  jest.mock("../user", () => ({
    findUserById: jest.fn(),
  }));

  jest.mock("../../db", () => ({
    upsertWalletBalance: jest.fn(),
  }));


describe("[TEST] Credit a wallet", () => {
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


    it("should check account existence and return 404 if account does not exist", async () => {
        const accountId = "123456";
        (findUserById as jest.Mock).mockResolvedValueOnce(null);
        req.body = { accountId, amount: 100 };

        await creditWallet()(req, res, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Account not valid");
    });

    it("should credit wallet and return the updated wallet", async () => {
        const accountId = "123456";
        const amount = 100;
        const mockWallet = { accountId, balance: 200 };
        (findUserById as jest.Mock).mockResolvedValueOnce({ _id: accountId });
        (upsertWalletBalance as jest.Mock).mockResolvedValueOnce(mockWallet);
        req.body = { accountId, amount };
    
        await creditWallet()(req, res, next);
    
        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockWallet);
        expect(logger.info).toHaveBeenCalledWith("[SERVICE], End credit operation");
      });
})