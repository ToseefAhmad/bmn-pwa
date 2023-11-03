import React, { Fragment } from 'react'
import { shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocatorPage.css'

import t from '@bmn/translate'

import StoreLocator from './StoreLocator/storeLocator'
import StoreLocatorOverview from './StoreLocator/storeLocatorOverview'
import { useLoadScript } from "@react-google-maps/api";

import { HeadProvider, Title as MetaTitle, Robots } from '@magento/venia-ui/lib/components/Head'
import { Helmet } from 'react-helmet-async'
import { Canonical } from '../../../../../../src/components/Canonical'
import Title from '../../../../../../src/components/Title'
import useStoreLocator from '../../talons/store-locator/useStoreLocator'

export const GOOGLE_MAPS_LIBRARIES = ['places']

const StoreLocatorPage = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    storeLocatorConfig,
    storeLocatorStoreList
  } = useStoreLocator()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: storeLocatorConfig.store_locator_general_api_key,
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const data = {
    "@context": "http://schema.org/",
    "@type": "Product"
  };

  return (
    <HeadProvider>
      <Robots/>
      <Canonical
        href={ window.location.href }
      />
      <Helmet>
        <script type='application/ld+json'>
          { JSON.stringify(data) }
        </script>
      </Helmet>
      <MetaTitle>{ `${t({ s: 'Stores' }) } - ${ STORE_NAME }` }</MetaTitle>
      {
        isLoaded
          ? <div className={ classes.container }>
              <Title
                type={ 'h1' }
                title={ t({ s: 'Search store' }) }
              />
              <StoreLocator
                storeLocatorConfig={ storeLocatorConfig }
                storeLocatorStoreList={ storeLocatorStoreList }
              />
              <StoreLocatorOverview
                blockId={ storeLocatorConfig.store_locator_pwa_cms_block }
              />
            </div>
          : <Fragment />
      }
    </HeadProvider>
  )
}

StoreLocatorPage.propTypes = {
  classes: shape({
    container: string,
  }),
}

export default StoreLocatorPage
