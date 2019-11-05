const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
    // Send a confirmation link to the email address
    res.send({ msg: "successfully registered" });

    const emailToken = await jwt.sign(
      { user_id: newUser.id },
      process.env.EMAIL_SECRET,
      { expiresIn: "1d" }
    );

    const confirmation_url = `http://localhost:3000/confirmation/${emailToken}`;

    console.log("ConfirmationURL:", confirmation_url);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL, // generated ethereal user
        pass: process.env.NODEMAILER_PASSWORD // generated ethereal password
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "admin", // sender address
      to: email, // list of receivers
      subject: "Confirm Email", // Subject line
      html: `Please click this link to confirm your email address: <a href=${confirmation_url} target="_blank">${confirmation_url}</a>` // html body
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
    // Check whether the user confirmed their email address
    if (!fetchedUser.confirmed) {
      return res.status(401).send({ msg: "Please confirm your email address" });
    }
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

const logout = (_, res) => {
  res.clearCookie("jwt");
  res.send({ msg: "successfully logout" });
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

const confirmation = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(422).send({ msg: "Invalid confirmation url" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.EMAIL_SECRET);
    if (!decoded) {
      return res.status(422).send({ msg: "Invalid confirmation url" });
    }
    const confirmedUser = await user.update(
      { id: decoded.user_id },
      { confirmed: true }
    );
    console.log("Confirmed User:", confirmedUser);
    res.send({ msg: "Successfully confirmed" });
  } catch (e) {
    console.error(e);
    return res.status(422).send({ msg: "Invalid confirmation url" });
  }
};

module.exports = {
  register,
  login,
  logout,
  reload,
  refresh_token,
  confirmation
};
