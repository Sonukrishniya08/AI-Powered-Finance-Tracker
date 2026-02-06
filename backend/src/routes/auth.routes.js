const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/register", controller.register);

module.exports = router;
