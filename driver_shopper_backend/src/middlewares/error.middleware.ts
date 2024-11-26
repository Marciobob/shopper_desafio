import { Request, Response, NextFunction } from 'express';

// Middleware global para tratamento de erros
const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno no servidor.' });
};

export default errorMiddleware;
