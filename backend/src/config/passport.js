const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");
const { v4: uuid } = require("uuid");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // ✅ Check if user already exists
        let user = await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [email]
        );

        if (user.rows.length === 0) {
          const newId = uuid();

          await pool.query(
            "INSERT INTO users (id, name, email, password) VALUES ($1,$2,$3,$4)",
            [newId, profile.displayName, email, null]   // ✅ password NULL
          );

          user = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
          );
        }

        // ✅ IMPORTANT FIX
        done(null, user.rows[0]);   // 🔥 return full user

      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;



// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const pool = require("./db");
// const jwt = require("jsonwebtoken");
// const { v4: uuid } = require("uuid");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;

//         let user = await pool.query(
//           "SELECT * FROM users WHERE email=$1",
//           [email]
//         );

//         if (user.rows.length === 0) {
//           const newId = uuid();
//           await pool.query(
//             "INSERT INTO users (id, name, email) VALUES ($1,$2,$3)",
//             [newId, profile.displayName, email]
//           );

//           user = await pool.query(
//             "SELECT * FROM users WHERE email=$1",
//             [email]
//           );
//         }

//         const token = jwt.sign(
//           { id: user.rows[0].id },
//           process.env.JWT_SECRET,
//           { expiresIn: "1d" }
//         );

//         done(null, { token });

//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );


// module.exports = passport;
