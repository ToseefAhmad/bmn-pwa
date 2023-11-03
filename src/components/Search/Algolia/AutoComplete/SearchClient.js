import React from 'react'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, Index, Configure } from 'react-instantsearch-dom'
import SearchResults from './SearchResults'
import { string } from 'prop-types'
import cssClasses from './../algolia.less'
import { useHistory } from 'react-router-dom'

const SearchClient = props => {
  const {
    appId,
    searchOnlyApiKey,
    productIndexId
  } = props

  const history = useHistory()
  const searchClient = algoliasearch(appId, searchOnlyApiKey)

  // You can add multiple indexes here if you want to render different kinds of data
  return (
    <InstantSearch
      indexName={ productIndexId }
      searchClient={ searchClient }
    >
      <Configure hitsPerPage={ 9 }/>
      <div className={ cssClasses.searchResultContainer }>
        <SearchResults
          onSuggestionSelected={ () => {} }
          history={ history }
        />
      </div>
      <Index indexName={ productIndexId }/>
    </InstantSearch>
  )
}

SearchClient.propTypes = {
  appId: string,
  searchOnlyApiKey: string,
  productIndexId: string
}

SearchClient.defaultProps = {
  appId: '',
  searchOnlyApiKey: '',
  productIndexId: ''
}

export default SearchClient
