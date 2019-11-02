const { Router } = require("express");

const { channel } = require("../controllers");
const { protect } = require("../middlewares/authentication");

const router = Router();

router.get("/", protect, channel.readAll);

module.exports = router;
