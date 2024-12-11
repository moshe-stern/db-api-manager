import express, { Request, Response, NextFunction } from "express";
import { AppError } from "..";
import { getClientByPhoneNumber } from "../services/client";
import { getRefreshTimes } from "../services/cube-status";

const router = express.Router();
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const times = await getRefreshTimes();
      res.status(200).json(times);
    } catch (error) {
      next(new AppError((error as Error).message, 500));
    }
  },
);

export default router;
