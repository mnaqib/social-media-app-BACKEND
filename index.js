const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')

const { MONGODB } = require('./config')
const Post = require('./models/Post')

const typeDefs = gql`
  type Query {
    getPosts: [Post]
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
`

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find()
        return posts
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log('Mongodb connected')
    return server.listen({ port: 5000 })
  })
  .then((res) => {
    console.log(`server running at ${res.url}`)
  })
