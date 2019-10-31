const bcrypt = require("bcrypt");
const { user } = require("../queries");

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
    return res.status(201).send(newUser);
  } catch (e) {
    console.error(e);
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check whether user with given name exists
    const users = await user.read({ name });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  register,
  login
};
