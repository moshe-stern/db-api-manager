import express, { Request, Response, NextFunction } from 'express';
import { createClientResponseRecord, getClientByNumber } from '../services/twilio';
import { IClientResponseRecord } from '../types';

const router = express.Router();

router
  .route('/client-response')
  .get(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const phoneNumber = req.query.phoneNumber as string;
      if (!phoneNumber) {
        res.status(400).json({ message: "Missing required parameter: phoneNumber" });
        return;
      }
      const records = await getClientByNumber(phoneNumber);
      if (records.length > 0) {
        res.status(200).json(records);
      } else {
        res.status(404).json({ message: "No records found for the provided phone number." });
      }
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = req.body as IClientResponseRecord;

      if (!client) {
        res.status(400).json({ message: "Missing client data in request body." });
        return;
      }
      
      const result = await createClientResponseRecord(client);
      if (result > 0) {
        res.status(201).json({ message: "Client record created successfully." });
      } else {
        res.status(500).json({ message: "Failed to create client record." });
      }
    } catch (error) {
      next(error);
    }
  });

export default router;
