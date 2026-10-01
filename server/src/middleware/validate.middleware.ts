import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * validate — runs after express-validator chain, returns 400 if any errors
 */
export const validate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({ field: e.type, message: e.msg })),
        });
        return;
    }
    next();
};
