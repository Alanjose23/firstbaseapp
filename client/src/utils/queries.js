import { gql } from '@apollo/client';

const USER_FIELDS = `
  _id email name age ageRangeMin ageRangeMax bio interests favoriteShows tier
  socialMedia { instagram twitter tiktok }
`;

export const QUERY_ME = gql`
  query Me {
    me {
      ${USER_FIELDS}
      connections     { ${USER_FIELDS} }
      pendingRequests { ${USER_FIELDS} }
    }
  }
`;

export const GET_CONVERSATION = gql`
  query GetConversation($userId: ID!) {
    getConversation(userId: $userId) {
      _id
      content
      createdAt
      sender    { _id name email }
      recipient { _id name email }
    }
  }
`;

export const QUERY_DISCOVER = gql`
  query DiscoverUsers {
    discoverUsers {
      ${USER_FIELDS}
    }
  }
`;
