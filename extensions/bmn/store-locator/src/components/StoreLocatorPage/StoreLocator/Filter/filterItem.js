import React, { Fragment } from 'react'
import { array, func, int, object, oneOfType, shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './filterItem.css'

import t from '@bmn/translate'

const FilterItem = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  let nearestLocationItems = <></>
  const {
    baseUrl,
    currentLocation,
    nearestLocations,
    calculateDistanceFunction
  } = props

  const getRouteUrl = (location) => {
    return 'https://maps.google.com/?daddr=' + location + '&saddr=Current Location'
  }

  if (nearestLocations.length > 0) {
    nearestLocationItems = nearestLocations.map((nearestLocation) => {
      return (
        <div
          key={ 'filterItem_' + nearestLocation.name }
          className={ classes.sl__filterItemWrapper }
        >
          <a
            href={ baseUrl + '/' + nearestLocation.url }
            className={ classes.sl__filterItem }
          >
            <div className={ classes.sl__filterItemInfo }>
              <span
                className={ `${ classes.sl__filterItemTitle } ${ classes.sl__filterItemText }` }>{ nearestLocation.name }</span>
              <span className={ classes.sl__filterItemText }>{ nearestLocation.street }</span>
              <span
                className={ classes.sl__filterItemText }>{ `${ nearestLocation.zip } ${ nearestLocation.city }` }</span>
              <span className={ classes.sl__filterItemText }>{ nearestLocation.phone }</span>
            </div>
            <div className={ `${ classes.sl__filterItemLocationDetails } ${ classes.sl__filterItemText }` }>
            <span className={ classes.sl__filterItemDistance }>
              {
                t({
                  s: '%1 km', r: [
                    calculateDistanceFunction(
                      currentLocation.lat,
                      currentLocation.lng,
                      nearestLocation.latitude,
                      nearestLocation.longitude,
                    )
                  ]
                })
              }
            </span>
              <span className={ classes.sl__filterItemViewLocation }>{ t({ s: 'View location' }) }</span>
            </div>
          </a>
          {
            nearestLocation.location
              ? <a
                className={ classes.sl__filterItemPlanRoute }
                href={ getRouteUrl(nearestLocation.location) }
                target={ '_blank' }
              >
                { t({ s: 'Plan route' }) }
              </a> : <></>
          }
        </div>
      )
    })
  }

  return (
    <Fragment>
      { nearestLocationItems }
    </Fragment>
  )
}

FilterItem.propTypes = {
  baseUrl: string.isRequired,
  currentLocation: shape({
    lat: int,
    lng: int
  }).isRequired,
  nearestLocations: oneOfType([ object, array ]).isRequired,
  calculateDistanceFunction: func.isRequired,
  classes: shape({
    sl__filterItem: string,
    sl__filterItemWrapper: string,
    sl__filterItemInfo: string,
    sl__filterItemText: string,
    sl__filterItemTitle: string,
    sl__filterItemLocationDetails: string,
    sl__filterItemDistance: string,
    sl__filterItemViewLocation: string,
    sl__filterItemPlanRoute: string
  })
}

export default FilterItem
