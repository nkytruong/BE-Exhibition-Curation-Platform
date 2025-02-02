"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.checkIfUserExists = checkIfUserExists;
exports.loginUser = loginUser;
const users_model_1 = require("../models/users-model");
const auth_utils_1 = require("../utils/auth-utils");
function registerUser(req, res) {
    const { email, first_name, surname, password } = req.body;
    if (!email || !first_name || !surname || password) {
        res.status(400).send({ msg: "All fields are required" });
    }
}
function checkIfUserExists() { }
const authenticateUser = (req, res) => { };
function loginUser(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send({ msg: "Email and Password are both required" });
    }
    (0, users_model_1.fetchUser)(email).then((user) => {
        return (0, auth_utils_1.verifyPassword)(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return Promise.reject({ status: 400, msg: "Incorrect email or password" });
            }
            const token = (0, auth_utils_1.generateToken)(user.userId);
        });
    });
}
// const logoutUser = (req: Request, res: Response) => {};
