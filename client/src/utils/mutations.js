import { gql } from '@apollo/client';

export const ADD_USER = gql`
query User($userId: ID!) {
  User(userId: $userId) {
    username
  }
}
`;


export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
      }
    }
  }
`;
