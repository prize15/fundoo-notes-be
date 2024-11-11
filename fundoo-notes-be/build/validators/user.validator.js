"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
class UserValidator {
    constructor() {
        this.registerUser = (req, res, next) => {
            const schema = joi_1.default.object({
                firstname: joi_1.default.string().required(),
                lastname: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(6).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next({ code: 400, message: error.details[0].message });
            }
            next();
        };
        this.loginUser = (req, res, next) => {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(6).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next({ code: 400, message: error.details[0].message });
            }
            next();
        };
    }
}
exports.default = UserValidator;
