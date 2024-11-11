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
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    constructor() {
        // Get all users
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.find();
            return data;
        });
        // Create a new user
        this.newUser = (body) => __awaiter(this, void 0, void 0, function* () {
            // Check if the user already exists
            const existingUser = yield user_model_1.default.findOne({ email: body.email });
            if (existingUser) {
                throw { code: 400, message: 'User already exists' };
            }
            // Hash the password before saving
            const salt = yield bcryptjs_1.default.genSalt(10);
            body.password = yield bcryptjs_1.default.hash(body.password, salt);
            const data = yield user_model_1.default.create(body);
            return data;
        });
        // Login user
        this.loginUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                throw { code: 401, message: 'Invalid email or password' };
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                throw { code: 401, message: 'Invalid email or password' };
            }
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({ user: { id: user._id } }, 'your-secret-key', {
                expiresIn: '1h' // Token expiration time
            });
            return token;
        });
        // Get a single user
        this.getUser = (_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.findById(_id);
            if (!data) {
                throw { code: 404, message: 'User not found' };
            }
            return data;
        });
        // Update a user
        this.updateUser = (_id, body) => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.findByIdAndUpdate({ _id }, body, { new: true });
            if (!data) {
                throw { code: 404, message: 'User not found' };
            }
            return data;
        });
        // Delete a user
        this.deleteUser = (_id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByIdAndDelete(_id);
            if (!user) {
                throw { code: 404, message: 'User not found' };
            }
            return 'User deleted successfully';
        });
        // Get user by email
        this.getUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ email });
        });
        // Get user by ID
        this.getUserById = (_id) => __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(_id);
        });
        // Update user password
        this.updateUserPassword = (_id, newPassword) => __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findByIdAndUpdate(_id, { password: newPassword }, { new: true });
        });
    }
}
exports.default = UserService;
