import { validateRequestBody } from "../lib/validator";
import { creditWallet, debitWallet } from "../service/wallet";

export const credit = [
    validateRequestBody(),
    creditWallet(),
  ];

export const debit = [
  validateRequestBody(),
  debitWallet(),
]