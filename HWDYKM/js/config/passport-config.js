const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
    var authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user !== true) {
            return done(null, false, { message: "no user with that email" });
        }
        try {
            if (await bcrypt.compare(password, user.password)) { //think I need to alter this
                return done(null, user);
            } else {
                return done(null, false, { message: "password incorrect" });
            }
        } catch (err) {
            return done(err);
        }
    }
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser)) //setting user name to email overrides default that relies on a username
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

module.exports = initialize;
