import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { APIError } from "./http-error";

export const validateRequestBody = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    next()
  } catch (error) {
    const err = new APIError({
      message: 'Data supplied does not match the schema',
      status: 400
    });
    return next(err);
  }
};