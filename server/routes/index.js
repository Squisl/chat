const { Router } = require("express");

const user = require("./user");

const router = Router();

router.use("/api/user", user);

module.exports = router;
