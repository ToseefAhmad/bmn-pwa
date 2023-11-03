import React, { Fragment } from 'react'
import { shape, string, object, array, oneOfType } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocatorPage.less'

import t from '@bmn/translate'

import Title from '../Title'
import StoreLocator from './StoreLocator/storeLocator'
import StoreLocatorOverview from './StoreLocator/storeLocatorOverview'
import { useLoadScript } from "@react-google-maps/api";

import { HeadProvider, Title as MetaTitle, Robots } from '@magento/venia-ui/lib/components/Head'
import { Helmet } from 'react-helmet-async'
import { Canonical } from "../Canonical";

export const GOOGLE_MAPS_LIBRARIES = ['places']

const StoreLocatorPage = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    storeLocatorConfig,
    storeLocatorStoreList
  } = props

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
  storeLocatorConfig: shape({
    store_locator_advanced_cluster_grid_size: string,
    store_locator_advanced_custom_map_styles: string,
    store_locator_advanced_groups: oneOfType([object, array]),
    store_locator_advanced_location_zoom: string,
    store_locator_advanced_map_type_control: string,
    store_locator_advanced_max_cluster_zoom: string,
    store_locator_advanced_mobile_location_zoom: string,
    store_locator_advanced_mobile_zoom: string,
    store_locator_advanced_nearest_locations: string,
    store_locator_advanced_scroll_wheel_zoom: string,
    store_locator_advanced_street_view_control: string,
    store_locator_advanced_units: string,
    store_locator_advanced_zoom: string,
    store_locator_general_active_marker_class: string,
    store_locator_general_api_key: string,
    store_locator_general_language: string,
    store_locator_general_lat: string,
    store_locator_general_lng: string,
    store_locator_general_location_class: string,
    store_locator_general_marker_class: string,
    store_locator_general_store_url: string,
    store_locator_general_use_info_window: string,
    store_locator_pwa_cms_block: string
  }).isRequired,
  storeLocatorStoreList: oneOfType([object, array]).isRequired,
  classes: shape({
    container: string,
  }),
}

export default StoreLocatorPage
