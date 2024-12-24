import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../helpers";
import { verifyToken } from "../services/auth";

const router = express.Router();

router.get(
  "/get-secret",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken = req.body as string
      await verifyToken(accessToken, (err) => {
        if (err) {
          return res.status(401).json({ error: "Invalid token", details: err.message });
        }
        res.status(200).json({
          secret: process.env.SECRET_KEY
        })
      });
    } catch (error) {
      next(new AppError((error as Error).message, 500));
    }
  },
);

export default router;
