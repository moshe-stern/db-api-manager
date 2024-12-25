import express, { Request, Response, NextFunction } from "express";
import { AppError } from "..";
import { getClientByPhoneNumber } from "../services/client";
import {
  getMsgBoard,
  getRefreshTimes,
  updateMsgBoard,
} from "../services/cube-status";

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

router
  .route("/message-board")
  .get(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const msg = await getMsgBoard();
        res.status(200).json(msg);
      } catch (error) {
        next(new AppError((error as Error).message, 500));
      }
    },
  )
  .patch(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { message } = req.body as { message: string };
        const affected = await updateMsgBoard(message);
        if (affected > 0) {
          res.status(201).json({ message: "Succesfully updated message" });
        } else {
          res.status(500).json({ message: "Failed to update message" });
        }
      } catch (error) {
        next(new AppError((error as Error).message, 500));
      }
    },
  );
export default router;
