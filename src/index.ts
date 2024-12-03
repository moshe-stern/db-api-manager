import express, { Response, Request, NextFunction } from "express";
import twilio from "./routes/twilio";
import providers from "./routes/providers";
import dotenv from 'dotenv'
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 8080;
class AppError extends Error {
    status: number;
    isOperational: boolean;
    constructor(message: string, status: number) {
        super(message);
        this.status = status || 500;
        this.isOperational = true;
    }
}
app.use(express.json())
app.use("/twilio", twilio);
app.use("/providers", providers)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const errorMessage = err.isOperational
        ? err.message
        : 'Something went very wrong!';

    console.error('Error:', err);
    res.status(statusCode).json({
        error: {
            message: errorMessage,
        },
    });
});

app.listen(PORT, () => console.log(`app started on port ${PORT}`));
