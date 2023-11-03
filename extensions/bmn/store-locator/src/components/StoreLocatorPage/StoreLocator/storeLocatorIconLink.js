import React from 'react'
import { shape, string } from 'prop-types'
import { useQuery } from "@apollo/client"
import { Link } from 'react-router-dom'

import GET_STORE_LOCATOR_CONFIG from '../../../queries/getStoreLocatorConfig.graphql'
import defaultClasses from './storeLocatorIconLink.css'
import { mergeClasses } from '@magento/venia-ui/lib/classify'

const StoreLocatorIconLink = props => {
  const classes = mergeClasses(defaultClasses, props.classes)

  const {
    data,
    loading,
    error
  } = useQuery(GET_STORE_LOCATOR_CONFIG)

  if (loading || error || !data) {
    return <></>
  }

  const storeLocatorLink = 'storeConfig' in data && 'store_locator_general_store_url' in data.storeConfig
    ? data.storeConfig.store_locator_general_store_url
    : 'vestigingen'

  return (
    <Link to={ '/' + storeLocatorLink }>
      <i className={ classes.storeLocatorIcon }/>
    </Link>
  )
}

export default StoreLocatorIconLink

StoreLocatorIconLink.propTypes = {
  classes: shape({
    storeLocatorIcon: string
  })
}
