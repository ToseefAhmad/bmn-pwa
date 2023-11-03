import { gql } from '@apollo/client'

export const GET_FILTER_TYPE = gql`
  query getFilterType {
    storeConfig {
      id
      catalog_pwa_catalog_filter_filter_type
    }
  }
`
