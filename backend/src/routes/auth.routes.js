const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    res.json({ token });
  }
);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
