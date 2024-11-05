import { Request, Response, NextFunction, RequestHandler } from 'express';

export const passwordValidator: RequestHandler = (req, res, next) => {
    const { password } = req.body;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumericOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasNumericOrSymbol) {
        res.status(400).json({
            message: "Password must contain at least one uppercase letter and one numeric or symbolic character."
        });
        return;
    }

    next();
};
