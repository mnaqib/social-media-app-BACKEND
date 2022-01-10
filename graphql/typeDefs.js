const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(input: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    image: String!
    comments: [Comment]!
    likes: [Like]!
    likesCount: Int
    CommentsCount: Int!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    image: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    createdAt: String
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    image: String!
  }
`
