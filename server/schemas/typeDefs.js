const typeDefs = `#graphql
  type SocialMedia {
    instagram: String
    twitter:   String
    tiktok:    String
  }

  input SocialMediaInput {
    instagram: String
    twitter:   String
    tiktok:    String
  }

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
    socialMedia: SocialMedia
    tier: String
    connections:     [User]
    pendingRequests: [User]
  }

  type Message {
    _id: ID
    sender:    User
    recipient: User
    content:   String
    createdAt: String
  }

  type Auth {
    user: User
  }

  type Query {
    me: User
    discoverUsers: [User]
    getConversation(userId: ID!): [Message]
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
      socialMedia: SocialMediaInput
    ): User

    sendRequest(userId: ID!): User
    acceptRequest(userId: ID!): User
    declineRequest(userId: ID!): User
    removeConnection(userId: ID!): User
    sendMessage(recipientId: ID!, content: String!): Message
  }
`;

module.exports = typeDefs;
