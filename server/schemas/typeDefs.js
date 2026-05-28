const typeDefs = `#graphql
  type User {
    _id: ID
    email: String
    name: String
    age: Int
    ageRangeMin: Int
    ageRangeMax: Int
    bio: String
    interests: [String]
    favoriteShows: [String]
    connections:     [User]
    pendingRequests: [User]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    discoverUsers: [User]
  }

  type Mutation {
    addUser(email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    updateProfile(
      name: String
      age: Int
      ageRangeMin: Int
      ageRangeMax: Int
      bio: String
      interests: [String]
      favoriteShows: [String]
    ): User

    sendRequest(userId: ID!): User
    acceptRequest(userId: ID!): User
    declineRequest(userId: ID!): User
    removeConnection(userId: ID!): User
  }
`;

module.exports = typeDefs;
