import { Response, Request, NextFunction } from "express";

async function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
}

function auth(req: Request, res: Response, next: NextFunction) {
  const secretKey = req.header("SECRET_KEY");
  const expectedKey = process.env.SECRET_KEY;
  if (!secretKey || secretKey !== expectedKey) {
    res.status(403);
    return;
  }
  next();
}

class AppError extends Error {
  status: number;
  isOperational: boolean;
  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    this.isOperational = true;
  }
}
export { errorHandler, auth, AppError };
