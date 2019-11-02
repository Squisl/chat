const { Router } = require("express");

const { user } = require("../controllers");
const { schemas, check } = require("../middlewares/validation");

const router = Router();

router.post("/register", check(schemas.register), user.register);
router.post("/login", user.login);
router.get("/reload", user.reload);
router.get("/refresh_token", user.refresh_token);

module.exports = router;
