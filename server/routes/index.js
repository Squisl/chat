const { Router } = require("express");

const user = require("./user");
const channel = require("./channel");

const router = Router();

router.use("/api/user", user);
router.use("/api/channel", channel);

module.exports = router;
