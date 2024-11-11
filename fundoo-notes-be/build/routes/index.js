"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const note_route_1 = __importDefault(require("./note.route")); // Import note routes
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const router = express_1.default.Router();
const routes = () => {
    router.get('/', (req, res) => {
        res.json('Welcome');
    });
    router.use('/users', new user_route_1.default().getRoutes());
    router.use('/notes', new note_route_1.default().getRoutes()); // Add note routes here
    router.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    return router;
};
exports.default = routes;
