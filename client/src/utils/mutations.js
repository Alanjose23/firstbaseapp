import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation AddUser($email: String!, $password: String!) {
    addUser(email: $email, password: $password) {
      user { _id email }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user { _id email }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $age: Int
    $ageRangeMin: Int
    $ageRangeMax: Int
    $bio: String
    $interests: [String]
    $favoriteShows: [String]
    $socialMedia: SocialMediaInput
  ) {
    updateProfile(
      name: $name
      age: $age
      ageRangeMin: $ageRangeMin
      ageRangeMax: $ageRangeMax
      bio: $bio
      interests: $interests
      favoriteShows: $favoriteShows
      socialMedia: $socialMedia
    ) {
      _id name age ageRangeMin ageRangeMax bio interests favoriteShows tier
      socialMedia { instagram twitter tiktok }
    }
  }
`;

export const SEND_REQUEST = gql`
  mutation SendRequest($userId: ID!) {
    sendRequest(userId: $userId) { _id }
  }
`;

export const ACCEPT_REQUEST = gql`
  mutation AcceptRequest($userId: ID!) {
    acceptRequest(userId: $userId) { _id }
  }
`;

export const DECLINE_REQUEST = gql`
  mutation DeclineRequest($userId: ID!) {
    declineRequest(userId: $userId) { _id }
  }
`;

export const REMOVE_CONNECTION = gql`
  mutation RemoveConnection($userId: ID!) {
    removeConnection(userId: $userId) { _id }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($recipientId: ID!, $content: String!) {
    sendMessage(recipientId: $recipientId, content: $content) {
      _id content createdAt
      sender    { _id name email }
      recipient { _id name email }
    }
  }
`;
