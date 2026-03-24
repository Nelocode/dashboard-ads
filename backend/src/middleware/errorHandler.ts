import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Handler]:', err);

  if (err instanceof ZodError) {
    const message = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return res.status(400).json(ApiResponse.error('VALIDATION_ERROR', message));
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json(ApiResponse.error(
    err.name || 'INTERNAL_SERVER_ERROR',
    message
  ));
};
