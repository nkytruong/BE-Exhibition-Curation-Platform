"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
exports.users = [
    {
        user_id: 1,
        email: "john@example.com",
        first_name: "John",
        surname: "Doe",
        // This is a bcrypt-hashed version of "password123" with 10 salt rounds.
        password: "$2b$10$g4Rqk5z4XavOSWqMEq41Y.FF6o7XFpnqjKHGjULSg9VoLVa3Oj.1K",
        created_at: "2025-01-01T10:00:00Z",
    },
    {
        user_id: 2,
        email: "jane@example.com",
        first_name: "Jane",
        surname: "Smith",
        // This is a bcrypt-hashed version of "janepass" (example password).
        password: "$2b$10$.n1UX4R4XhvtUPTNTpC4ce/A.0TNZaVNL2bZT9GN5WMiFeE4dJOAW",
        created_at: "2025-01-02T10:00:00Z",
    },
    {
        user_id: 3,
        email: "bob@example.com",
        first_name: "Bob",
        surname: "Ross",
        // This is a bcrypt-hashed version of "happytrees" (example password).
        password: "$2b$10$4bD0XA7QdTejwCnQGYRMZ.c5SXbc5EVAphWnzHqFnPvZ.3ADbp7ES",
        created_at: "2025-01-03T10:00:00Z",
    }
];
