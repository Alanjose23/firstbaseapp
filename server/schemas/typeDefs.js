const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    email: String
    date: ID
  }

  type Date {
    _id: ID
    user_id: ID
    future: String
    journal: String
  }

  type Query {
    Users: [User]!
    User(userId: ID!): User
    UserDate(userId: ID!): User
    GetDate(id: ID!): Date
    GetJournal(userId: ID!): User
    GetFuture(userId: ID!): User
  }

  type Mutation {
    addUser(username: String!, password: String!, email: String!): User
    removeUser(userId: ID!): User
    addDate(userId: ID!, future: String!, journal: String!): Date

  }
`


module.exports = typeDefs;
