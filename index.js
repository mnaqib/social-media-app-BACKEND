const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
})

const port = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Mongodb connected')
    return server.listen({ port })
  })
  .then((res) => {
    console.log(`server running at ${res.url}`)
  })
