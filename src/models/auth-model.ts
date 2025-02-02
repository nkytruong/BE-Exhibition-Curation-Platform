import db from "../db/connection";
import { hashPassword } from "../utils/auth-utils";

export function findUserByEmail(email: string) {
    return db.query(
        `SELECT * FROM users WHERE email = $1;`,
        [email]
    )
    .then(({rows}) => {
       return rows.length? rows[0] : null
    })
}

export function createUser(email: string, first_name: string, surname: string, password: string) {
    return hashPassword(password)
    .then((hashed_password) => {
        return db.query(
            `INSERT INTO users (email, first_name, surname, hashed_password) VALUES ($1, $2, $3, $4) RETURNING user_id, email, first_name, surname, created_at;`,
            [email, first_name, surname, hashed_password]
        )
    })
    .then(({rows}) => {
        return rows[0]
    })
}