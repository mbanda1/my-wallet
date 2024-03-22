import { validateRequestBody } from "../lib/validator";
import { creditWallet } from "../service/wallet";

export const credit = [
    validateRequestBody(),
    creditWallet(),
  ];