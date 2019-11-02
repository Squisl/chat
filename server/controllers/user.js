const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { user } = require("../queries");
const createToken = require("../utilities/createToken");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const errors = {};
  try {
    // Check whether name or email address is already registered
    const userEmail = await user.read({ email });
    const userName = await user.read({ name });
    // If name or email address are already registered, then send error response
    if (userEmail.length > 0 && userEmail[0].email === email) {
      errors.email = "Email address is already registered";
    }
    if (userName.length > 0 && userName[0].name === name) {
      errors.name = "Username is already registered";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(422).send(errors);
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create new user
    const newUser = await user.create({
      email,
      name,
      password: hashedPassword
    });
    const { id, token_version } = newUser;
    // Create refresh token
    const refreshToken = createToken(
      { id, token_version },
      process.env.REFRESH_SECRET,
      process.env.REFRESH_EXPIRATION
    );
    // Save refresh token in a cookie
    res.cookie("jwt", refreshToken, {
      maxAge: parseInt(process.env.REFRESH_EXPIRATION),
      httpOnly: true,
      sameSite: true,
      secure: false
    });
    // Create access token
    const accessToken = createToken(
      { id, token_version },
      process.env.ACCESS_SECRET,
      process.env.ACCESS_EXPIRATION
    );
    return res.status(201).send({
      user: { id, email, name },
      token: accessToken
    });
  } catch (e) {
    console.error(e);
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check whether user with given name exists
    const users = await user.read({ name });
    if (users.length === 0) {
      return res.status(404).send({ name: "Name not found" });
    }
    const fetchedUser = users[0];
    // Compare passwords
    const match = await bcrypt.compare(password, fetchedUser.password);
    if (!match) {
      return res.status(401).send({ password: "Wrong Password" });
    }
    const { id, email, token_version } = fetchedUser;
    // Create refresh token
    const refreshToken = createToken(
      { id, token_version },
      process.env.REFRESH_SECRET,
      process.env.REFRESH_EXPIRATION
    );
    // Save refresh token in a cookie
    res.cookie("jwt", refreshToken, {
      maxAge: parseInt(process.env.REFRESH_EXPIRATION),
      httpOnly: true,
      sameSite: true,
      secure: false
    });
    // Create access token
    const accessToken = createToken(
      { id, token_version },
      process.env.ACCESS_SECRET,
      process.env.ACCESS_EXPIRATION
    );
    res.send({
      token: accessToken,
      user: { id, name, email }
    });
  } catch (e) {
    console.error(e);
  }
};

const reload = async (req, res) => {
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
    const { id, email, name } = result[0];
    res.send({ id, email, name });
  } catch (e) {
    console.error(e);
  }
};

const refresh_token = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ token: "Token not found" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.REFRESH_SECRET);
    if (!decoded) {
      return res.status(401).send({ token: "Invalid token" });
    }
    const result = await user.read({ id: decoded.id });
    if (result.length === 0) {
      return res.status(401).send({ token: "Invalid token" });
    }
    const fetchedUser = result[0];
    const { id, token_version } = fetchedUser;
    const accessToken = createToken(
      { id, token_version },
      process.env.ACCESS_SECRET,
      process.env.ACCESS_EXPIRATION
    );
    res.send({ token: accessToken });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  register,
  login,
  reload,
  refresh_token
};
