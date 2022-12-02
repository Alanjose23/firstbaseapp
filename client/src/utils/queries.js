import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
query Users {
  Users {
    _id
    username
    email
    password
    date
  }
}
`;

export const QUERY_SINGLE_USER = gql`
query User($userId: ID!) {
  User(userId: $userId) {
    date
    email
    username
    password
  }
}
`;
