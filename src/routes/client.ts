import express, { Request, Response, NextFunction } from 'express';
import { AppError } from '..';
import { getClientOrgIdByPhoneNumber } from '../services/client';

const router = express.Router();

router
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const phoneNumber = req.query.phoneNumber as string;
        if (!phoneNumber) {
          res.status(400).json({ message: "Missing required parameter: phoneNumber" });
          return;
        }
        const orgId = await getClientOrgIdByPhoneNumber(phoneNumber);
        if (orgId) {
          res.status(200).json(orgId);
        } else {
          res.status(404).json({ message: "No records found for the provided phone number." });
        }
      } catch (error) {
        next(new AppError((error as Error).message, 500));
      }
  });
  
export default router;
