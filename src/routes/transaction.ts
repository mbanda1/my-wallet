import { Router } from 'express';
import { body } from 'express-validator';
import { send } from '../controllers/transaction';

const router = Router();

const accountDebitRules = [
    body('debitAccountId').notEmpty().withMessage('Sender account is required'),
    body('creditAccountId').notEmpty().withMessage('Receiver account is required'),
    body('amount').notEmpty().isNumeric().withMessage('Enter valid amount'),
  ];

router.post('/send', accountDebitRules, send);

export default router;