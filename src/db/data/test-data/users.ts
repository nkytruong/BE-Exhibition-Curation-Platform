import { User } from "../../../types/types";

export const users: User[] = [
  {
    user_id: 1,
    email: "john@example.com",
    first_name: "John",
    surname: "Doe",
    password: "password123",
    created_at: "2025-01-01T10:00:00Z",
  },
  {
    user_id: 2,
    email: "jane@example.com",
    first_name: "Jane",
    surname: "Smith",
    password: "janepass",
    created_at: "2025-01-02T10:00:00Z",
  },
  {
    user_id: 3,
    email: "bob@example.com",
    first_name: "Bob",
    surname: "Ross",
    password: "happytrees",
    created_at: "2025-01-03T10:00:00Z",
  },
  {
    user_id: 4,
    email: "poppy@example.com",
    first_name: "Poppy",
    surname: "Bloom",
    password: "123",
    created_at: "2025-01-03T10:00:00Z",
  },
];
