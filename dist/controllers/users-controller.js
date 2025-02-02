"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("../models/users-model");
exports.getUser = (req, res, next) => {
    const { email } = req.params;
    (0, users_model_1.fetchUser)(email)
        .then((user) => {
        res.status(200).send({ user });
    })
        .catch((err) => {
        next(err);
    });
};
