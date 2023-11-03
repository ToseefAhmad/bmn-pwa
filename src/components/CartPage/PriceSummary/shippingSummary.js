import React, { Fragment } from 'react'
import gql from 'graphql-tag'
import { Price } from '@magento/peregrine'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import t from '@bmn/translate'
import { arrayOf, number, shape, string } from 'prop-types'

/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const ShippingSummary = props => {
  const classes = mergeClasses({}, props.classes)
  const { data } = props

  // Don't render estimated shipping until an address has been provided and
  // a method has been selected.
  if (!data.length || !data[0].selected_shipping_method) {
    return <Fragment />
  }

  const shipping = data[0].selected_shipping_method.amount

  // For a value of "0", display "FREE".
  const price = shipping.value ? (
    <Price value={ shipping.value } currencyCode={ shipping.currency }/>
  ) : (
    <span>{ t({ s: 'Free' }) }</span>
  )

  return (
    <Fragment>
      <span className={ classes.lineItemLabel }>
        { t({ s: 'Shipping' }) }
      </span>
      <span className={ classes.price }>{ price }</span>
    </Fragment>
  )
}

ShippingSummary.propTypes = {
  classes: shape({
    lineItemLabel: string,
    price: string
  }),
  data: arrayOf(shape({
    selected_shipping_method: shape({
      amount: shape({
        value: number,
        currency: string
      })
    })
  }))
}

export const ShippingSummaryFragment = gql`
  fragment ShippingSummaryFragment on Cart {
    id
    shipping_addresses {
      selected_shipping_method {
        amount {
          currency
          value
        }
      }
    }
  }
`

export default ShippingSummary
