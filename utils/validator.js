exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
  image
) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }
  if (image.trim() === '') {
    errors.image = 'Image must not be empty'
  }
  if (email.trim() === '') {
    errors.email = 'Email must not be empty'
  } else {
    const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!regEx.test(email)) {
      errors.email = 'Email must be a valid email address'
    }
  }
  if (password === '') {
    errors.password = 'Password must not be empty'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

exports.validateLoginInput = (username, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }

  if (password.trim() === '') {
    errors.password = 'password must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
