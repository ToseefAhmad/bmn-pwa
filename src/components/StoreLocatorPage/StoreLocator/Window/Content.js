import React from 'react'
import { array, object, oneOfType, shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './Content.less'

import Button, { BUTTON_TYPE_ACTION_EXTERNAL } from '../../../Button'

import t from '@bmn/translate'

const Window = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    selectedStore,
    storeLocatorConfig
  } = props

  return (
    <>
      <div className={ classes.sl__content }>
        <strong className={ classes.sl__iwTitle }>{ selectedStore.name }</strong>
        <span className={ classes.sl__iwText }>{ selectedStore.street }</span>
        <span className={ classes.sl__iwText }>{ `${ selectedStore.zip } ${ selectedStore.city }` }</span>
        <a
          className={ `${ classes.sl__iwText } ${ classes.sl__iwCall }` }
          href={ 'tel:' + selectedStore.phone }
          title={ t({ s: 'Call %1', r: [selectedStore.name] }) }
        >
          { selectedStore.phone }
        </a>
      </div>
      <Button
        type={ BUTTON_TYPE_ACTION_EXTERNAL }
        cssClass={ 'primary' }
        text={ t({ s: 'Opening hours & contact information' }) }
        onClick={ () => {
          location.assign(storeLocatorConfig.store_locator_general_store_url + '/' + selectedStore.url)
        } }
      />
    </>
  )
}

Window.propTypes = {
  selectedStore: shape({
    city: string,
    id: string,
    latitude: string,
    longitude: string,
    marker_class: string,
    name: string,
    phone: string,
    street: string,
    url: string,
    zip: string,
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
    sl__content: string,
    sl__iwTitle: string,
    sl__iwText: string,
    sl__iwCall: string,
    sl__button: string,
  })
}

export default Window
