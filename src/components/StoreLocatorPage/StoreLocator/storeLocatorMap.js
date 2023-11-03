import React, { useState } from 'react'
import { array, func, number, object, oneOfType, shape, string } from 'prop-types'

import Content from './Window/Content'
import MarkerIcon from './Marker/Icon/marker.svg'

import { mergeClasses } from '@magento/venia-ui/lib/classify'

import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api'
import defaultClasses from "./storeLocatorMap.less"

const StoreLocatorMap = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const [ selected, setSelected ] = useState({})
  const [ map, setMap ] = useState({})

  const onSelect = item => {
    setSelected(item)
  }

  const {
    storeLocatorStoreList,
    callback,
    currentLocation,
    storeLocatorConfig
  } = props

  const updateLocation = (map) => {
    let event = {}
    event.latitude = map.getCenter().lat()
    event.longitude = map.getCenter().lng()

    callback(event, true)
  }

  const markers = storeLocatorStoreList.map((store) => {
    return <Marker
      name={ store.name }
      address={ store.street }
      zip={ store.zip }
      city={ store.city }
      phone={ store.phone }
      url={ store.url }
      key={ store.id }
      position={ {
        lat: parseFloat(store.latitude),
        lng: parseFloat(store.longitude)
      } }
      onClick={ () => onSelect(store) }
      icon={ {
        url: MarkerIcon
      } }
    />
  })

  return (
    <div className={ classes.sl__map }>
      <GoogleMap
        zoom={ parseInt(storeLocatorConfig.store_locator_advanced_location_zoom) }
        center={ currentLocation }
        onLoad={ map => {
          setMap(map)
        } }
        onDragEnd={ () => {
          updateLocation(map)
        } }
        onZoomChanged={ () => {
          if (Object.keys(map).length > 0) {
            updateLocation(map)
          }
        } }
        onClick={ () => {
          setSelected({})
        }}
      >
        { markers }
        {
          selected.name &&
          (
            <InfoWindow
              position={ {
                lat: parseFloat(selected.latitude),
                lng: parseFloat(selected.longitude)
              } }
              clickable={ true }
              onCloseClick={ () => setSelected({}) }
            >
              <Content
                selectedStore={ selected }
                storeLocatorConfig={ storeLocatorConfig }
              />
            </InfoWindow>
          )
        }
      </GoogleMap>
    </div>
  )
}

StoreLocatorMap.propTypes = {
  storeLocatorStoreList: oneOfType([object, array]).isRequired,
  callback: func.isRequired,
  currentLocation: shape({
    lat: oneOfType([string, number]),
    lng: oneOfType([string, number])
  }).isRequired,
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
  classes: shape({
    sl__map: string
  }),
}

export default StoreLocatorMap
