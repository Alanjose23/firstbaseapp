const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    zipcode: String
    date: ID
  }

  type Date {
    _id: ID
    user: ID
    future: String
    journal: String
  }

  type Query {
    Users: [User]!
    User(userId: ID!): User
    UserDate(userId: ID!): User
  }

  type Mutation {
    addUser(username: String!, password: String!, zipcode: String!): User
    removeUser(userId: ID!): User
    addDate(user: ID!, future: String!, journal: String!): Date

  }
`


module.exports = typeDefs;
