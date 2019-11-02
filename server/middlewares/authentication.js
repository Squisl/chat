const jwt = require("jsonwebtoken");

const { user } = require("../queries");

const protect = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ token: "Token not found" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_SECRET);
    if (!decoded) {
      return res.status(401).send({ token: "Invalid token" });
    }
    const result = await user.read({ id: decoded.id });
    if (result.length === 0) {
      return res.status(404).send({ token: "Invalid token" });
    }
    req.user = result[0];
    next();
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  protect
};
