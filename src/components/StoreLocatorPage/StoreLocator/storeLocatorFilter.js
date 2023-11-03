import React from 'react'
import { array, func, object, oneOfType, shape, string, number } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocatorFilter.less'

import FilterSearch from './Filter/filterSearch'
import FilterItem from './Filter/filterItem'

const StoreLocatorFilter = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    storeLocatorConfig,
    callback,
    currentLocation,
    nearestLocations,
    calculateDistanceFunction
  } = props
  
  const baseUrl = storeLocatorConfig.store_locator_general_store_url
  
  return (
    <div className={ classes.sl__filter }>
      <div className={ classes.sl__filterHead }>
        <FilterSearch
          storeLocatorConfig={ storeLocatorConfig }
          callback={ callback }
        />
      </div>
      {
        nearestLocations ?
          <div className={ classes.sl__filterResults }>
            <FilterItem
              baseUrl={ baseUrl }
              currentLocation={ currentLocation }
              nearestLocations={ nearestLocations }
              calculateDistanceFunction={ calculateDistanceFunction }
            />
          </div> : <></>
      }
    </div>
  )
}

StoreLocatorFilter.propTypes = {
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
  callback: func.isRequired,
  currentLocation: shape({
    lat: oneOfType([string, number]),
    lng: oneOfType([string, number])
  }).isRequired,
  nearestLocations: oneOfType([object, array]).isRequired,
  calculateDistanceFunction: func.isRequired,
  classes: shape({
    sl__filter: string,
    sl__filterHead: string,
    sl__filterResults: string
  }),
}

export default StoreLocatorFilter
