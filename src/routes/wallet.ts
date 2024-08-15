import { Router } from 'express';
import { body } from 'express-validator';
import { credit, debit } from '../controllers/wallet';

const router = Router();

const accountCreditRules = [
    body('accountId').notEmpty().withMessage('Account is required'),
    body('amount').notEmpty().isInt({ min: 0 }).withMessage('Enter valid amount'),
  ];

router.post('/credit', accountCreditRules, credit);
router.post('/debit', accountCreditRules, debit);

export default router;