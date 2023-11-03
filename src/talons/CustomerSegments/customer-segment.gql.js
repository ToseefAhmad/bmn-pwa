import { gql } from '@apollo/client';

export const GET_CUSTOMER_SEGMENTS = gql`
  query getCustomerSegments {
    customer {
      id
      segments {
        id
      }
    }
  }
`
