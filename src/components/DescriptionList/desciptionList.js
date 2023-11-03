import React, { Fragment } from 'react';
import { shape, arrayOf, string } from 'prop-types'

const DescriptionList = props => {
  const { data } = props
  let descriptionListContent
  
  if (data) {
    descriptionListContent = data.map((item, key) => {
      for (let [property, value] of Object.entries(item)) {
        if (value) {
          return (
            <Fragment key={key}>
              <dt>{property}</dt>
              <dd>{value}</dd>
            </Fragment>
          )
        }
      }
    })
  }
  
  return descriptionListContent ?
    <dl>
      {descriptionListContent}
    </dl>
    : <></>
}

export default DescriptionList
