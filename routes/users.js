const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");

router.route("/register")
    .get(users.register)
    .post(catchAsync(users.addUser))

router.route("/login")
    .get(users.login)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.loggedIn)

router.get("/logout", users.logout)

module.exports = router;