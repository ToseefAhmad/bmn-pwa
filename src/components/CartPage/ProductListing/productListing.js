import React, { Fragment } from 'react'
import gql from 'graphql-tag'
import { useProductListing } from '../../../talons/CartPage/ProductListing/useProductListing'
import { mergeClasses } from "@magento/venia-ui/lib/classify"

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator'
import EditModal from '@magento/venia-ui/lib/components/CartPage/ProductListing/EditModal'
import Product from './product'
import { ProductListingFragment } from './productListingFragments'
import defaultClasses from "./productListing.less"
import t from '@bmn/translate'
import { bool, func, shape, string } from 'prop-types'

const ProductListing = props => {
  const {
    isCartUpdating,
    setIsCartUpdating
  } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const talonProps = useProductListing({
    queries: {
      getProductListing: GET_PRODUCT_LISTING
    },
    isCartUpdating
  })
  const {
    activeEditItem,
    isLoading,
    items,
    setActiveEditItem
  } = talonProps

  if (isLoading) {
    return <LoadingIndicator>{ t({ s: 'Fetching Cart...' })}</LoadingIndicator>
  }

  if (items.length) {
    const productComponents = items.map(product => (
      <Product
        item={ product }
        key={ product.id }
        setActiveEditItem={ setActiveEditItem }
        setIsCartUpdating={ setIsCartUpdating }
      />
    ))

    return (
      <Fragment>
        <div className={ classes.heading }>
          <span className={ classes.product }>{ t({ s: 'Item' }) }</span>
          <span className={ classes.ppu }>{ t({ s: 'Price per unit' }) }</span>
          <span className={ classes.price }>{ t({ s: 'Price' }) }</span>
          <span className={ classes.qty }>{ t({ s: 'Qty' }) }</span>
          <span className={ classes.subtotal }>{ t({ s: 'Subtotal' }) }</span>
        </div>
        <ul>
          { productComponents }
        </ul>
        <EditModal
          item={ activeEditItem }
          setIsCartUpdating={ setIsCartUpdating }
        />
      </Fragment>
    )
  }

  return null
}

export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`

ProductListing.propTypes = {
  isCartUpdating: bool,
  setIsCartUpdating: func,
  classes: shape({
    heading: string,
    product: string,
    ppu: string,
    price: string,
    qty: string,
    subtotal: string
  })
}

export default ProductListing
