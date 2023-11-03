import React from 'react'
import { array, object, oneOfType, shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocatorDetailPage.less'

import Title from '../Title'

const StoreLocatorDetailPage = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    storeLocatorConfig,
    storeLocatorStore
  } = props
  
  return (
    <div className={ classes.container }>
      <Title
        type={ 'h1' }
        title={ storeLocatorStore.name }
      />
    </div>
  )
}

StoreLocatorDetailPage.propTypes = {
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
  storeLocatorStore: shape({
    name: string
  }).isRequired,
  classes: shape({
    container: string,
  })
}

export default StoreLocatorDetailPage
