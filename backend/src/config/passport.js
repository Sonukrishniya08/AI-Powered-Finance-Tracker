const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");
const { v4: uuid } = require("uuid");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const user = await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [email]
        );

        if (user.rows.length > 0) {
          return done(null, user.rows[0]);
        }

        const newUser = await pool.query(
          "INSERT INTO users (id, name, email, password) VALUES ($1,$2,$3,$4) RETURNING *",
          [uuid(), profile.displayName, email, null]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
