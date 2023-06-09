const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User{
  _id : ID!
  username: String!
  email: String!
  password: String
  bookCount: Int
  savedBooks: [Book]
}

type Book {
  bookId: ID
  authors: [String]
  description: String
  title: String
  image: String
  link: String
}

input BookInput {
  bookId: ID
  authors: [String]
  description: String
  title: String
  image: String
  link: String
}

type Auth {
  token: ID!
  user: User
}

type Query {
  users: [User]
  user(username: String!): User
  me: User
}

type Mutation{
  loginUser(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook( UserId: ID!, body: BookInput!): User
  removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;
