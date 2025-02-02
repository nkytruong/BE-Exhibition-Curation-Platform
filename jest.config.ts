import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest", // Ensure Jest processes TypeScript files correctly
  },
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Adjust for path aliases if needed
  },
  setupFiles: ["dotenv/config"], // This ensures `.env` files are loaded
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Additional setup (optional)
testPathIgnorePatterns: ["<rootDir>/dist/"]
};

export default config;
