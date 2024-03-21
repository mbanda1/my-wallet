import { sendMoney } from "../service/transaction";

export const send = [
  // .... more middlewares should we have need
    sendMoney(),
  ];