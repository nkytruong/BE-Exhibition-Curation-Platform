import { User } from "../../../types/types";

export const users: User[] = [
    {
        user_id: "d422f33b-1d52-41a7-8b54-3386159cc23a",
        email: "john@example.com",
        first_name: "John",
        surname: "Doe",
        // This is a bcrypt-hashed version of "password123" with 10 salt rounds.
        password: "$2b$10$g4Rqk5z4XavOSWqMEq41Y.FF6o7XFpnqjKHGjULSg9VoLVa3Oj.1K",
        created_at: "2025-01-01T10:00:00Z",
      },
      {
        user_id: "f25a6e8a-d5ca-46d3-915e-eb7f1417f3a3",
        email: "jane@example.com",
        first_name: "Jane",
        surname: "Smith",
        // This is a bcrypt-hashed version of "janepass" (example password).
        password: "$2b$10$.n1UX4R4XhvtUPTNTpC4ce/A.0TNZaVNL2bZT9GN5WMiFeE4dJOAW",
        created_at: "2025-01-02T10:00:00Z",
      },
      {
        user_id: "b4aa6274-49c9-4ba7-950a-5685db0ac71a",
        email: "bob@example.com",
        first_name: "Bob",
        surname: "Ross",
        // This is a bcrypt-hashed version of "happytrees" (example password).
        password: "$2b$10$4bD0XA7QdTejwCnQGYRMZ.c5SXbc5EVAphWnzHqFnPvZ.3ADbp7ES",
        created_at: "2025-01-03T10:00:00Z",
      }
]