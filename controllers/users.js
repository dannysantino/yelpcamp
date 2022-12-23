const User = require("../models/user");


module.exports.register = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "Action Forbidden!")
        return res.redirect("/campgrounds");
    }
    res.render("users/register")
}

module.exports.addUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to YelpCamp Santino!");
            res.redirect("/campgrounds");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register")
    }
}

module.exports.login = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "Action Forbidden!");
        return res.redirect("/campgrounds");
    }
    res.render("users/login");
}

module.exports.loggedIn = (req, res) => {
    req.flash("success", `Welcome back, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.flash("success", `Goodbye, ${req.user.username}!`);
    req.logout();
    res.redirect("/campgrounds")
}