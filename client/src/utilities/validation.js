const validator = require("validator");

// Form validations
export const registerValidation = data => {
  const errors = {};

  if (!validator.isLength(data.name, { min: 2, max: 20 })) {
    errors.name = "Name must be between 2 and 20 characters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Email address is invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email address is required";
  }
  if (!validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = "Password must be between 6 and 20 characters";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (!validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password must match Password";
  }
  if (validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password is required";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

export const loginValidation = data => {
  const errors = {};

  if (!validator.isLength(data.name, { min: 2, max: 20 })) {
    errors.name = "Name must be between 2 and 20 characters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }
  if (!validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = "Password must be between 6 and 20 characters";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

export const channelValidation = data => {
  const errors = {};

  if (!validator.isLength(data.name, { min: 2, max: 20 })) {
    errors.name = "Name must be between 2 and 20 characters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};
