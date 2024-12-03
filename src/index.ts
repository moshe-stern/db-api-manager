import express, { Response, Request, NextFunction } from "express";
import twilio from "./routes/twilio";
import providers from "./routes/providers";

const app = express();
const PORT = 3000;
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
app.listen(PORT);
