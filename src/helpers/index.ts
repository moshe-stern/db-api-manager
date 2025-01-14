import { AppError } from 'attain-aba-shared'
import { Response, Request, NextFunction } from 'express'
async function errorHandler(
     err: AppError,
     req: Request,
     res: Response,
     next: NextFunction
) {
     const statusCode = err.status || 500
     const errorMessage = err.isOperational
          ? err.message
          : 'An unknown error occured'
     console.error('Error:', err)
     res.status(statusCode).json({
          error: {
               message: errorMessage,
          },
     })
}
function auth(req: Request, res: Response, next: NextFunction) {
     const secretKey = req.header('SECRET_KEY')
     const expectedKey = process.env.SECRET_KEY
     if (!secretKey || secretKey !== expectedKey) {
          res.status(403).json({
               message: 'Unauthorized',
          })
     } else {
          next()
     }
}

export { errorHandler, auth }
