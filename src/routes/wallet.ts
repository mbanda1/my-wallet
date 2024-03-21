import { Router, Request, Response } from 'express';
import { credit } from '../controllers/wallet';
import { body } from 'express-validator';

const router = Router();

const accountCreditRules = [
    body('accountId').notEmpty().withMessage('Account is required'),
    body('amount').notEmpty().isNumeric().withMessage('Enter valid amount'),
  ];

router.post('/credit', accountCreditRules, credit);

export default router;