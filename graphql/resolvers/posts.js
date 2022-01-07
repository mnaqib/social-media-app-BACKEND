const { AuthenticationError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/check-auth')

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      } catch (e) {
        throw new Error(e)
      }
    },

    getPost: async (parent, { postId }, context) => {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    createPost: async (parent, { body }, context) => {
      const user = checkAuth(context)

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save()
      return post
    },

    deletePost: async (parent, { postId }, context) => {
      const user = checkAuth(context)

      try {
        const post = await Post.findById(postId)

        if (!post) {
          throw new Error('Post not found')
        } else {
          if (post.username !== user.username) {
            throw new AuthenticationError('Action not alowed')
          }
        }

        post.delete()
        return 'deleted successfully'
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
