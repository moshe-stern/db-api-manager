import express, { Request, Response, NextFunction } from 'express';
import { createClientResponseRecord, getClientByNumber } from '../services/twilio';
import { IClientResponseRecord, IProvider } from '../types';
import { getProvidersByEmails } from '../services/providers';

const router = express.Router();

router
router.post('/providers-by-emails', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { emails } = req.body;
        if (!Array.isArray(emails) || emails.some((email) => typeof email !== 'string')) {
        res.status(400).json({ message: 'Invalid request. "emails" must be an array of strings.' });
        return;
      }
      const providers: IProvider[] = await getProvidersByEmails(emails);
        res.status(200).json(providers);
    } catch (error) {
      next(error);
    }
  });
  
export default router;
