"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function generateToken(userId) {
    const jwtSecret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ userId }, jwtSecret, { expiresIn: "365d" });
    //   res.cookie("authToken", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV !== "development", //change to "production" later
    //     sameSite:"strict",
    //     maxAge: 3600000,
    //   })
    return token;
}
// export function clearToken(res: Response){
//     res.cookie("authToken", "", {
//         httpOnly: true,
//         expires: new Date(0)
//     })
// }
// export function logout(){
//     localStorage.removeItem("authToken")
//     window.location.href
// }
function verifyToken(token) {
    const jwtSecret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.verify(token, jwtSecret);
}
function hashPassword(password) {
    const saltRounds = 10;
    return bcryptjs_1.default.hash(password, saltRounds);
}
function verifyPassword(password, hashedPassword) {
    return bcryptjs_1.default.compare(password, hashedPassword);
}
