"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../data/development-data/index");
const seed_1 = require("../seeds/seed");
const connection_1 = __importDefault(require("../connection"));
const runSeed = () => {
    return (0, seed_1.seed)(index_1.devData).then(() => connection_1.default.end());
};
runSeed();
