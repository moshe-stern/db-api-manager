import express, { Request, Response, NextFunction } from 'express';
import { AppError } from '..';
import { getClientByPhoneNumber } from '../services/client';

const router = express.Router();

router
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const phoneNumber = req.query.phoneNumber as string;
        if (!phoneNumber) {
          res.status(400).json({ message: "Missing required parameter: phoneNumber" });
          return;
        }
        const client = await getClientByPhoneNumber(phoneNumber);
        if (client) {
          res.status(200).json(client);
        } else {
          res.status(404).json({ message: "No client found for the provided phone number." });
        }
      } catch (error) {
        next(new AppError((error as Error).message, 500));
      }
  });
  
export default router;