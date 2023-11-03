import React from 'react'
import { Price } from '@magento/peregrine'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import t from '@bmn/translate'
import { number, shape, string } from 'prop-types'

/**
 * A component that renders a total summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const TotalSummary = props => {
  const classes = mergeClasses({}, props.classes)
  const { data, label } = props

  return (
    <>
      <span className={ classes.lineItemLabel }>
        { t({ s: label }) }
      </span>
      <span className={ classes.price }>
        <Price
          value={ data.value }
          currencyCode={ data.currency }
        />
      </span>
    </>
  )
}

TotalSummary.propTypes = {
  classes: shape({
    lineItemLabel: string,
    price: string
  }),
  data: shape({
    currency: string,
    value: number
  })
}

export default TotalSummary
