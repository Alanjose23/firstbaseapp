const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    zipcode: Number
  }

  type Query {
    Users: [User]!
    User(userId: ID!): User
  }

  type Mutation {
    addUser(username: String!, password: String!, zipcode: Number!): User
    removeUser(userId: ID!): User
  }
`;

module.exports = typeDefs;
