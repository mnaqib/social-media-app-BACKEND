const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentsResolvers = require('./comments')
const Post = require('../../models/Post')

module.exports = {
  Query: {
    ...postsResolvers.Query,
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },

  Post: {
    likesCount: async ({ likes }) => likes.length,
    CommentsCount: async ({ comments }) => comments.length,
  },
}
