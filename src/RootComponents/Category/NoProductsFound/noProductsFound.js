import React from 'react'
import { useQuery } from '@apollo/client'
import CmsBlock from '../../../components/Cms/Block'
import GET_NO_PRODUCTS_FOUND from '../../../queries/getNoProductsFoundConfig.graphql'

const NoProductsFound = () => {
  let content = <></>
  const {
    data,
    loading,
    error
  } = useQuery(GET_NO_PRODUCTS_FOUND)

  if (loading || error) {
    return content
  }

  const identifier = data.storeConfig.catalog_pwa_catalog_pages_cms_block_no_products
  if (identifier) content = <CmsBlock blockId={ identifier }/>

  return content
}

export default NoProductsFound