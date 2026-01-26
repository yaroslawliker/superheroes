import { Request, Response, NextFunction} from 'express'

export function logRequest(req: Request, sep: Response, next: NextFunction) {
    const method = req.method;
    const path = req.baseUrl;
    console.log(`${method} call on ${path}`);

    next();
}