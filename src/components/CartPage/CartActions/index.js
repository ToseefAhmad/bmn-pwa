import React from 'react'
import classNames from './cartActions.less'

import ContinueToCheckoutAction from './continueToCheckout'
import TransformToRequisitionListAction from './transformToRequisitionList'
import EmptyCartAction from './emptyCart'
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing'
import { GET_PRODUCT_LISTING } from '../ProductListing/productListing'
import { useCartContext } from '@magento/peregrine/lib/context/cart'

export const CartActions = props => {
  const { setIsCartUpdating } = props
  const [{ cartId }] = useCartContext();

  const productListingTalonProps = useProductListing({
    queries: {
      getProductListing: GET_PRODUCT_LISTING
    }
  })

  const {
    items,
    isLoading,
    quoteId
  } = productListingTalonProps

  return (
    !isLoading
      ? <div className={ classNames.cart__actions }>
        <EmptyCartAction
          cartItems={ items }
          setIsCartUpdating={ setIsCartUpdating }
        />
        <TransformToRequisitionListAction
          items={ items }
          setIsCartUpdating={ setIsCartUpdating }
        />
        <ContinueToCheckoutAction quoteId={ cartId }/>
      </div>
      : ''
  )
}

export default CartActions
