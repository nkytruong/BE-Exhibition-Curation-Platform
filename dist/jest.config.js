"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["dotenv/config"], // This ensures `.env` files are loaded
    //   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Additional setup (optional)
};
exports.default = config;
