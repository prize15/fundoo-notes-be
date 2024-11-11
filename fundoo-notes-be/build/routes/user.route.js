"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_validator_1 = __importDefault(require("../validators/user.validator"));
class UserRoutes {
    constructor() {
        this.userController = new user_controller_1.default();
        this.router = express_1.default.Router();
        this.userValidator = new user_validator_1.default();
        this.routes = () => {
            // Registration route
            this.router.post('/register', this.userValidator.registerUser, this.userController.registerUser);
            // Login route
            this.router.post('/login', this.userValidator.loginUser, this.userController.loginUser);
            // Forgot password route
            // Add the routes for forgot and reset password
            this.router.post('/forgot-password', this.userController.forgotPassword);
            this.router.post('/reset-password/:token', this.userController.resetPassword);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = UserRoutes;
