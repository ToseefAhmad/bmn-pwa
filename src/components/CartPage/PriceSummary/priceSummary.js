import React, { Fragment } from 'react'
import gql from 'graphql-tag'
import { usePriceSummary } from './usePriceSummary'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './priceSummary.less'
import DiscountSummary from './discountSummary'
import GiftCardSummary from './giftCardSummary.ee'
import ShippingSummary from './shippingSummary'
import TaxSummary from './taxSummary'
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql'
import ContinueToCheckoutAction from '../CartActions/continueToCheckout'
import t from '@bmn/translate'
import TotalSummary from './totalSummary'
import { bool, shape, string } from 'prop-types'
import FreeShippingCounter from '../FreeShippingCounter'
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator'

const GET_PRICE_SUMMARY = gql`
  query getPriceSummary($cartId: String!) {
    cart(cart_id: $cartId) @connection(key: "Cart") {
      id
      ...PriceSummaryFragment
    }
  }
  ${ PriceSummaryFragment }
`

/**
 * A component that fetches and renders cart data including:
 *  - subtotal
 *  - discounts applied
 *  - gift cards applied
 *  - tax
 *  - shipping
 *  - total
 */
const PriceSummary = props => {
  const { isUpdating } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const talonProps = usePriceSummary({
    queries: {
      getPriceSummary: GET_PRICE_SUMMARY
    },
    isUpdating
  })

  const {
    hasError,
    hasItems,
    isCheckout,
    isLoading,
    flatData
  } = talonProps

  if (hasError) {
    return (
      <div className={ classes.root }>
        Something went wrong. Please refresh and try again.
      </div>
    )
  } else if (!hasItems || isLoading) {
    return <LoadingIndicator>{ t({ s: 'Loading prices...' }) }</LoadingIndicator>
  }

  const {
    id,
    subtotal,
    total,
    totalExclTax,
    discounts,
    giftCards,
    taxes,
    shipping
  } = flatData

  const priceClass = isUpdating ? classes.priceUpdating : classes.price

  const proceedToCheckoutButton = !isCheckout ? (
    <div className={ classes.checkoutButton_container }>
      <ContinueToCheckoutAction quoteId={ id } />
    </div>
  ) : <Fragment />

  return (
    <div className={ classes.root }>
      <div className={ classes.summary__title }>
        { t({ s: 'Finalize order' }) }
      </div>
      <div className={ classes.summary__items }>
        {
          subtotal.value
            ? <div className={ classes.summary__item }>
                <TotalSummary
                  data={ subtotal }
                  label={ 'Subtotal' }
                />
              </div>
            : <Fragment />
        }
        {
          discounts
            ? <div className={ classes.summary__item }>
                <DiscountSummary
                  classes={ {
                    lineItemLabel: classes.summary__line,
                    price: priceClass
                  } }
                  data={ discounts }
                />
              </div>
            : <Fragment />
        }
        {
          giftCards.length
            ? <div className={ classes.summary__item }>
                <GiftCardSummary
                  classes={ {
                    lineItemLabel: classes.summary__line,
                    price: priceClass
                  } }
                  data={ giftCards }
                />
              </div>
            : <Fragment />
        }
        {
          shipping.length
            ? <div className={ classes.summary__item }>
                <ShippingSummary
                  classes={ {
                    lineItemLabel: classes.summary__line,
                    price: priceClass
                  } }
                  data={ shipping }
                  isCheckout={ isCheckout }
                />
              </div>
            : <Fragment />
        }
        <FreeShippingCounter
          subtotal={ subtotal }
        />
        {
          taxes.length
            ? <div className={ classes.summary__item }>
                <TaxSummary
                  classes={ {
                    lineItemLabel: classes.summary__line,
                    price: priceClass
                  } }
                  data={ taxes }
                  isCheckout={ isCheckout }
                />
              </div>
            : <Fragment />
        }
        {
          total.value
            ? <div className={ classes.summary__item + ' ' + classes.summary__total }>
                <TotalSummary
                  data={ total }
                  label={ 'Total (incl. Tax)' }
                />
              </div>
            : <Fragment />
        }
        {
          totalExclTax
            ? <div className={ classes.summary__item + ' ' + classes.summary__total }>
                <TotalSummary
                  data={ totalExclTax }
                  label={ 'Total (excl. Tax)' }
                />
              </div>
            : <Fragment />
        }
      </div>
      { proceedToCheckoutButton }
    </div>
  )
}
PriceSummary.propTypes = {
  classes: shape({
    checkoutButton_container: string,
    price: string,
    priceUpdating: string,
    summary__count: string,
    summary__item: string,
    summary__items: string,
    summary__line: string,
    summary__title: string,
    summary__total: string,
    root: string,
  }),
  isUpdating: bool
}


export default PriceSummary
