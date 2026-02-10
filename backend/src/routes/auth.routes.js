const router = require("express").Router();
const { register, login , getProfile , updateProfile} = require("../controllers/auth.controller");
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

    const token = generateToken(req.user.id);   // ✅ now works properly

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);



const authMiddleware = require("../middleware/auth.middleware");

router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);


router.post("/register", register);
router.post("/login", login);

module.exports = router;
