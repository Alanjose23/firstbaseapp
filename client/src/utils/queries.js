import { gql } from '@apollo/client';

const USER_FIELDS = `
  _id email name age ageRangeMin ageRangeMax bio interests favoriteShows
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

export const QUERY_DISCOVER = gql`
  query DiscoverUsers {
    discoverUsers {
      ${USER_FIELDS}
    }
  }
`;
