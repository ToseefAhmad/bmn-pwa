import React, { Fragment, useEffect } from 'react'
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage'
import { Title } from '@magento/venia-ui/lib/components/Head'
import CmsBlock from '../Cms/Block'
import CartQty from '../Cart/cart-qty'
import PriceSummary from './PriceSummary/priceSummary'
import ProductListing from './ProductListing/productListing'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './cartPage.less'
import { GET_CART_DETAILS } from './CartPage/cartPage.gql'
import t from '@bmn/translate'
import { shape, string } from 'prop-types'
import CartActions from './CartActions'
import CartCmsBlock from './CartCmsBlock/cart-cms-block'
import GET_CART_DELIVERY_TEXT from '../../queries/getCartDeliveryText.graphql'
import { useQuery } from '@apollo/client'
import { useAppContext } from '@magento/peregrine/lib/context/app'

const CartPage = props => {
  const [
    { isPageLoading }
  ] = useAppContext()

  const talonProps = useCartPage({
    queries: {
      getCartDetails: GET_CART_DETAILS
    }
  })

  const {
    cartItems,
    hasItems,
    isCartUpdating,
    setIsCartUpdating,
  } = talonProps

  useEffect(() => {
    let isLoading = true;
    if (isPageLoading) {
      setIsCartUpdating(isPageLoading)
    }

    return () => {
      isLoading = false
    }
  }, [isPageLoading, setIsCartUpdating])

  let content = '';
  const {
    data,
    loading,
    error
  } = useQuery(GET_CART_DELIVERY_TEXT)

  if (loading && error) {
    content = <span>{ t({ s: 'Choose your shipping or pickup moment in the next step.' }) }</span>
  }

  if (data && data.storeConfig.cart_pwa_choose_delivery_text !== null) {
    const deliveryText = data.storeConfig.cart_pwa_choose_delivery_text
    if (deliveryText) content = <span>{ deliveryText }</span>
  }

  const classes = mergeClasses(defaultClasses, props.classes)

  const productListing = !hasItems && !isCartUpdating
    ? <CmsBlock
        blockId={ 'empty_cart' }
        fallback={ t({ s: 'There are no items in your cart.' }) }
      />
    : <ProductListing setIsCartUpdating={ setIsCartUpdating } isCartUpdating={ isCartUpdating } />

  const priceSummary = hasItems
    ? <PriceSummary isUpdating={ isCartUpdating } />
    : null

  const summaryContainerClass = isCartUpdating
    ? classes.summary__container + ` ${classes['summary__container--loading'] }`
    : classes.summary__container

  return <div className={ classes.root }>
    <Title>
      { t({ s: 'Cart - %1', r: [`${ STORE_NAME }`] }) }
    </Title>
    {
      hasItems
        ? <div className={ classes.heading_container }>
            <h1 className={ classes.heading }>
              <CartQty /> { t({ s: 'products in your cart' }) }
            </h1>
          </div>
        : <Fragment />
    }
    <div className={ classes.body }>
      <div className={ classes.cart__container }>
        <div className={ classes.items_container }>
          { productListing }
          {
            hasItems
              ? <CartActions
                  setIsCartUpdating={ setIsCartUpdating }
                  isCartUpdating={ isCartUpdating }
                />
              : <Fragment />
          }
          {
            hasItems
              ? <CartCmsBlock />
              : <Fragment />
          }
        </div>
        {
          hasItems
           ? <div className={ summaryContainerClass }>
               <div className={ classes.summary__contents }>
                 { priceSummary }
               </div>
               <div className={ classes.summary__shipping }>
                 <span>{ content }</span>
               </div>
              </div>
            : <Fragment />
        }
      </div>
    </div>
  </div>
}

CartPage.propTypes = {
  classes: shape({
    body: string,
    cart__container: string,
    heading: string,
    heading_container: string,
    items_container: string,
    price_adjustments_container: string,
    root: string,
    summary_contents: string,
    summary_container: string,
  })
}

export default CartPage
