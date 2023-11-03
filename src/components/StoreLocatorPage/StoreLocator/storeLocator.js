import React, { useMemo, useCallback, useState } from 'react'
import { shape, object, array, string, oneOfType } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocator.less'

import StoreLocatorFilter from './storeLocatorFilter'
import StoreLocatorMap from './storeLocatorMap'

const StoreLocator = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    storeLocatorConfig,
    storeLocatorStoreList
  } = props

  const [ currentLocation, setCurrentLocation ] = useState({
    nearestLocations: {},
    currentLocation: {}
  })

  /**
   * Calculate distance between latitude and longitude of two places
   * @param latitude1
   * @param longitude1
   * @param latitude2
   * @param longitude2
   * @returns {number}
   */
  const calculateDistance = (
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) => {
    if ((latitude1 === latitude2) && (longitude1 === longitude2)) {
      return 0
    } else {
      const radiusLatitude1 = Math.PI * latitude1 / 180
      const radiusLatitude2 = Math.PI * latitude2 / 180
      const theta = longitude1 - longitude2
      const radiusTheta = Math.PI * theta / 180
      let distance = Math.sin(radiusLatitude1) * Math.sin(radiusLatitude2) + Math.cos(radiusLatitude1) * Math.cos(radiusLatitude2) * Math.cos(radiusTheta)

      if (distance > 1) {
        distance = 1
      }

      distance = Math.acos(distance)
      distance = distance * 180 / Math.PI
      distance = distance * 60 * 1.1515
      distance = distance * 1.609344

      return Math.round((distance + Number.EPSILON) * 10) / 10
    }
  }

  /**
   * Get 4 nearest locations based on latitude ant longitude
   * @param currentLatitude
   * @param currentLongitude
   * @param storeLocatorStoreList
   * @returns {*}
   */
  const getNearestLocation = (currentLatitude, currentLongitude, storeLocatorStoreList) => {
    let stores = storeLocatorStoreList.slice().sort(function (a, b) {
      const currentDistance = calculateDistance(
        currentLatitude,
        currentLongitude,
        a.latitude,
        a.longitude
      )

      const nextDistance = calculateDistance(
        currentLatitude,
        currentLongitude,
        b.latitude,
        b.longitude
      )

      return currentDistance - nextDistance
    })

    return stores.slice(0, 4)
  }

  const updateCurrentLocation = useCallback((event, preventMapReRender) => {
    const nearestStores = getNearestLocation(
      event.latitude,
      event.longitude,
      storeLocatorStoreList
    )

    setCurrentLocation({
        nearestLocations: nearestStores,
        currentLocation: {
          preventMapReRender: preventMapReRender,
          lat: parseFloat(event.latitude),
          lng: parseFloat(event.longitude)
        }
      })
  }, [])

  const getLocationOnEntry = () => {
    let location = {
      latitude: storeLocatorConfig.store_locator_general_lat,
      longitude: storeLocatorConfig.store_locator_general_lng
    }

    const query = window.location.search
    const urlParams = new URLSearchParams(query);

    if (urlParams.has('lat') && urlParams.has('long')) {
      location = {
        latitude: urlParams.get('lat'),
        longitude: urlParams.get('long')
      }
    }

    return location;
  }

  useMemo(() => {
    const location = getLocationOnEntry()

    setCurrentLocation({
      nearestLocations: getNearestLocation(
        location.latitude,
        location.longitude,
        storeLocatorStoreList
      ),
      currentLocation: {
        preventMapReRender: true,
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude)
      }
    })
  }, [])

  return (
    <div className={ classes.sl__root }>
      <StoreLocatorFilter
        storeLocatorConfig={ storeLocatorConfig }
        callback={ updateCurrentLocation }
        currentLocation={ currentLocation.currentLocation }
        nearestLocations={ currentLocation.nearestLocations }
        calculateDistanceFunction={ calculateDistance }
      />
      <StoreLocatorMap
        storeLocatorConfig={ storeLocatorConfig }
        callback={ updateCurrentLocation }
        currentLocation={ currentLocation.currentLocation }
        storeLocatorStoreList={ storeLocatorStoreList }
      />
    </div>
  )
}

StoreLocator.propTypes = {
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
    sl__root: string
  })
}

export default StoreLocator
