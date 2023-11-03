import React from 'react'
import SearchClient from './AutoComplete/SearchClient'

import { useQuery } from '@apollo/client'
import GET_ALGOLIA_CONFIG from '../../../queries/getAlgoliaConfig.graphql'

const AlgoliaSearch = () => {
  const { data, loading, error } = useQuery(GET_ALGOLIA_CONFIG)

  if (loading
    || error
    || !data
  ) return (<></>)

  return (
    <SearchClient
      appId={ data.algoliaConfig.app_id }
      searchOnlyApiKey={ data.algoliaConfig.search_only_api_key }
      productIndexId={ data.algoliaConfig.product_index_id }
    />
  )
}

export default AlgoliaSearch
