import db from "../db/connection";
import { User } from "../types/types";

export function fetchUser(user_id: number){
  return db.query(
    `SELECT user_id, email, first_name, surname, hashed_password, created_at FROM users WHERE user_id = $1;`,
    [user_id]
  )
  .then(({rows}) => {
    if(rows.length === 0 ) {
        return Promise.reject({status: 404, msg: "User Not Found"})
    }
    return rows[0]
  })
};
