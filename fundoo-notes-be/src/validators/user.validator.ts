import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class UserValidator {
  public registerUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return next({ code: 400, message: error.details[0].message });
    }
    next();
  };

  public loginUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return next({ code: 400, message: error.details[0].message });
    }
    next();
  };
}

export default UserValidator;
