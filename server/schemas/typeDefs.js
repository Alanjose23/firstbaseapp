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
    Dates(userId: ID!): [Dates]!
  }

  type Mutation {
    addUser(username: String!, password: String!, zipcode: Number!): User
    removeUser(userId: ID!): User
    addDateLocations(id: ID!, locations: String!): Dates
    addDateExp(id: ID!, Exp: Text!): Dates
  }
`;

module.exports = typeDefs;
