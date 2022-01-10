const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { titleCase } = require('title-case')
require('dotenv').config()

const User = require('../../models/User')
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validator')

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      image: user.image,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  )
}

module.exports = {
  Mutation: {
    register: async (parent, { input }, context) => {
      let { username, password, confirmPassword, email, image } = input
      //validate user data
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        image
      )
      username = titleCase(username)
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      //Make sure user doesnt already exist
      const user = await User.findOne({ username })

      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        })
      }

      //hash password
      //auth token

      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        image,
        createdAt: new Date().toISOString(),
      })

      const res = await newUser.save()

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token,
      }
    },

    login: async (parent, { username, password }, context) => {
      let { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      username = titleCase(username)

      const user = await User.findOne({ username })

      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user)
      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },
  },
}
