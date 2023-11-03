import React, { Fragment, useState } from 'react'

import { array, func, object, oneOfType, shape, string } from 'prop-types'

import PlacesAutocomplete, { geocodeByAddress, getLatLng, } from 'react-places-autocomplete'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './filterSearch.less'

import t from '@bmn/translate'

const filterSearch = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const geoLocationAvailable = 'geolocation' in navigator
  const [ address, setAddress ] = useState('')
  const {
    storeLocatorConfig,
    callback
  } = props

  /**
   * Search options
   * @type {{componentRestrictions: {country: *[]}}}
   */
  const searchOptions = {
    componentRestrictions: {
      country: [ storeLocatorConfig.store_locator_general_language ]
    }
  }

  /**
   * Update address state on change
   * @param address
   */
  const handleChange = address => {
    setAddress(address)
  }

  /**
   * Handle input select
   * @param address
   */
  const handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => onPlaceSelected(latLng))
      .catch(error => console.error('Error', error));
  }

  /**
   * Use geolocation to get current position and center map
   */
  const useLocation = () => {
    let event = {}
    navigator.geolocation.getCurrentPosition((position) => {
      event.latitude = position.coords.latitude
      event.longitude = position.coords.longitude

      callback(event, false)
    })
  }

  /**
   * When place is clicked from dropdown, recenter map position
   * @param latLng
   */
  const onPlaceSelected = (latLng) => {
    callback({
      latitude: latLng.lat,
      longitude: latLng.lng
    }, false)
  }

  return (
    <Fragment>
      <span>{ t({ s: 'Search by city, street, zip code or your location.' }) }</span>
      <PlacesAutocomplete
        value={ address }
        onChange={ handleChange }
        onSelect={ handleSelect }
        searchOptions={ searchOptions }
        highlightFirstSuggestion={ true }
      >
        { ({
             getInputProps,
             suggestions,
             getSuggestionItemProps
           }) => (
          <div className={ classes.filterSearch }>
            <input
              {
                ...getInputProps({
                  placeholder: t({ s: 'Look for a store' }),
                  className: classes.filterSearchInput,
                })
              }
            />
            <div className={ classes.filterSearchDropdown }>
              {
                suggestions.length ?
                  <div className={ classes.filterSearchDropdownBorder }>
                    {
                      suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? classes.filterSearchSuggestionActive
                          : classes.filterSearchSuggestion

                        return (
                          <div
                            { ...getSuggestionItemProps(suggestion, { className }) }
                            key={ suggestion.placeId }
                          >
                            <span>{ suggestion.description }</span>
                          </div>
                        )
                      })
                    }
                  </div>
                  : <></>
              }
            </div>
          </div>
        ) }
      </PlacesAutocomplete>
      {
        geoLocationAvailable ?
          <button
            type="button"
            onClick={ useLocation }
          >
            { t({ s: 'Use location' }) }
          </button> : <></>
      }
    </Fragment>
  )
}

filterSearch.propTypes = {
  storeLocatorConfig: shape({
    store_locator_advanced_cluster_grid_size: string,
    store_locator_advanced_custom_map_styles: string,
    store_locator_advanced_groups: oneOfType([ object, array ]),
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
  classes: shape({
    filterSearch: string,
    filterSearchInput: string,
    filterSearchDropdown: string,
    filterSearchDropdownBorder: string,
    filterSearchSuggestion: string,
    filterSearchSuggestionActive: string
  })
}

export default filterSearch
