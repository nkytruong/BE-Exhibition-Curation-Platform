"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = fetchUser;
exports.createUser = createUser;
const connection_1 = __importDefault(require("../db/connection"));
// import bcrypt from "bcryptjs"
function fetchUser(email) {
    return connection_1.default.query(`SELECT user_id, email, first_name, surname, password, created_at FROM users WHERE email = $1;`, [email])
        .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "User Not Found" });
        }
        return rows[0];
    });
}
;
function createUser(newUser) {
}
