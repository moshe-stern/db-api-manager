import express, { Response, Request, NextFunction } from "express";
import twilio from "./routes/twilio";
import providers from "./routes/providers";
import dotenv from "dotenv";
import client from "./routes/client";
import cubeStatus from "./routes/cube-status";
import cors from "cors";
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 8080;
export class AppError extends Error {
  status: number;
  isOperational: boolean;
  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    this.isOperational = true;
  }
}

app.use(cors());
app.use(express.json());
app.use("/twilio", twilio);
app.use("/providers", providers);
app.use("/client", client);
app.use("/cube-status", cubeStatus);
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const errorMessage = err.isOperational
    ? err.message
    : "An unknown error occured";

  console.error("Error:", err);
  res.status(statusCode).json({
    error: {
      message: errorMessage,
    },
  });
});

app.listen(PORT, () => console.log(`app started on port ${PORT}`));
