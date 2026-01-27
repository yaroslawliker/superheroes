import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validate = (schema: ZodType) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };