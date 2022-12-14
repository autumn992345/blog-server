// node_modules
const router = require("express").Router();

// controllers
const { authController } = require("../controllers");

router.post("/login", authController.login);
router.post("/google", authController.signinGoogle);
router.post("/register", authController.register);

module.exports = router;
