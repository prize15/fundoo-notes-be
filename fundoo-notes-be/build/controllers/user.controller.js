"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../services/user.service"));
const mailer_service_1 = __importDefault(require("../services/mailer.service"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
        // Registration method
        this.registerUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.newUser(req.body);
                res.status(201).json({ message: 'User registered successfully', user });
            }
            catch (error) {
                next(error); // Error handling middleware will take care of the response
            }
        });
        // Login method
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.userService.loginUser(email, password);
                res.status(200).json({ message: 'Login successful', token });
            }
            catch (error) {
                next(error); // Error handling middleware will take care of the response
            }
        });
        // Get all users
        this.getAllUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAllUsers();
                res.status(200).json(users);
            }
            catch (error) {
                next(error);
            }
        });
        // Get a single user
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(req.params._id);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        // Update a user
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userService.updateUser(req.params._id, req.body);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        });
        // Delete a user
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.deleteUser(req.params._id);
                res.status(204).json({ message: 'User deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        });
        // Forgot password - Send reset link
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield this.userService.getUserByEmail(email);
                if (!user) {
                    return res.status(404).json({ code: 404, message: 'User not found' });
                }
                // Create a reset token
                const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                // Send reset token to user email
                const resetLink = `${process.env.APP_HOST}/reset-password/${token}`;
                yield mailer_service_1.default.sendMail(user.email, 'Password Reset Request', `Click on this link to reset your password: ${resetLink}`);
                res.status(200).json({ message: 'Password reset link sent to email' });
            }
            catch (error) {
                next(error);
            }
        });
        // Reset password - Update user password
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = req.body;
            try {
                // Verify reset token
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield this.userService.getUserById(decoded._id);
                if (!user) {
                    return res.status(404).json({ code: 404, message: 'User not found' });
                }
                // Hash the new password
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                // Update user password
                yield this.userService.updateUserPassword(decoded._id, hashedPassword);
                res.status(200).json({ message: 'Password has been reset successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
