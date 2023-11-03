import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { AlertCircle as AlertCircleIcon } from 'react-feather'
import { useProduct } from '../../../talons/CartPage/ProductListing/useProduct'
import { Price, useToasts } from '@magento/peregrine'

import { mergeClasses } from "@magento/venia-ui/lib/classify"
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions'
import Quantity from './quantity'
import { Link } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon'
import Image from '@magento/venia-ui/lib/components/Image'
import defaultClasses from './product.less'
import { CartPageFragment } from '../cartPageFragments.gql'
import StockNotice from "../../StockNotice"
import InventoryUnit from '../../InventoryUnit/inventory-unit'
import RequisitionListMenu from '../../RequisitionList/requisition-list-menu'
import t from '@bmn/translate'
import { func, object, shape, string } from 'prop-types'

const IMAGE_SIZE = 100

const errorIcon = <Icon src={ AlertCircleIcon } attrs={ { width: 18 } }/>

const Product = props => {
  const { item, setActiveEditItem, setIsCartUpdating } = props
  const talonProps = useProduct({
    item,
    mutations: {
      removeItemMutation: REMOVE_ITEM_MUTATION,
      updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
    },
    setActiveEditItem,
    setIsCartUpdating
  })

  const {
    handleRemoveFromCart,
    handleUpdateItemQuantity,
    product,
    updateItemErrorMessage
  } = talonProps

  const [ , { addToast } ] = useToasts()
  useEffect(() => {
    if (updateItemErrorMessage) {
      addToast({
        type: 'error',
        icon: errorIcon,
        message: updateItemErrorMessage,
        dismissable: true,
        timeout: 10000
      })
    }
  }, [ addToast, updateItemErrorMessage ])

  const { currency, image, name, options, quantity, unitPrice, rowPrice } = product
  const classes = mergeClasses(defaultClasses, props.classes)
  const inventory_unit = item.product.inventory_unit || {}

  return (
    <li className={ classes.root }>
      <div className={ `${ classes.wrapper__padding } ${ classes.wrapper__product }` }>
        <div className={ classes.product__image }>
          <Image
            alt={ name }
            classes={ { image: classes.image, root: classes.imageContainer } }
            width={ IMAGE_SIZE }
            resource={ image }
          />
        </div>
        <div className={ classes.product__details }>
          <Link
            className={ classes.product__name }
            to={ item.product.url_key }
          >
            <span>{ name }</span>
          </Link>
          <StockNotice
            color={ item.product.stock_notice.color }
            text={ item.product.stock_notice.text }
            showIcon={ false }
            bold={ false }
            size={ '12px' }
          />
          <ProductOptions
            options={ options }
            classes={ {
              options: classes.options,
              optionLabel: classes.optionLabel
            } }
          />
        </div>
      </div>
      <div className={ classes.wrapper__mobile_bottom }>
        <div
          className={ `${ classes.wrapper__padding } ${ classes.wrapper__gray } ${ classes.wrapper__ppu } ` }
          data-label={ t({ s: 'Price per unit:' }) }
        >
          <strong>
            <Price
              currencyCode={ currency }
              value={ item.crh_data.unit_price }
            />
          </strong>
          <span>{ t({ s: 'Per' }) } { t({ s: item.crh_data.price_unit.toUpperCase() }) }</span>
        </div>
        <div
          className={ `${ classes.wrapper__padding } ${ classes.wrapper__gray } ${ classes.wrapper__price } ` }
          data-label={ t({ s: 'Price:' }) }
        >
          <strong>
            <Price
              currencyCode={ currency }
              value={ unitPrice }
            />
          </strong>
          <InventoryUnit
            isComplex={ inventory_unit.is_complex }
            packagingAmount={ inventory_unit.packaging_amount }
            packagingUnit={ inventory_unit.packaging_unit }
            realInventoryUnit={ inventory_unit.real_inventory_unit }
            squareMeter={ inventory_unit.square_meter }
            unitType={ inventory_unit.unit_type }
            pricePerUnit={ inventory_unit.price_per_unit }
            isMandatoryPackaging={ inventory_unit.is_mandatory_packaging }
          />
        </div>
        <div
          className={ `${ classes.wrapper__padding } ${ classes.wrapper__gray } ${ classes.wrapper__qty } ` }
          data-label={ t({ s: 'Qty:' }) }
        >
          <Quantity
            itemId={ item.id }
            initialValue={ quantity }
            onChange={ handleUpdateItemQuantity }
          />
        </div>
        <div
          className={ classes.wrapper__subtotal }
          data-label={ t({ s: 'Subtotal:' }) }
        >
          <Price
            currencyCode={ currency }
            value={ rowPrice }
          />
        </div>
      </div>

      <div className={ `${ classes.wrapper__bottom } ${ classes.wrapper__gray }` }>
        <RequisitionListMenu
          type={ 'icon-left' }
          products={ [item.product] }
          additionalActions={ { handleRemoveFromCart } }
          text={ t({ s: 'Move to favorites' }) }
        />
        <button
          type={ 'button' }
          onClick={ handleRemoveFromCart }
          className={ classes.cartItem__removeItem }
        >
          { t({ s: 'Remove' }) }
        </button>
      </div>
    </li>
  )
}

Product.propTypes = {
  classes: shape({
    wrapper__padding: string,
    wrapper__gray: string,
    wrapper__product: string,
    wrapper__ppu: string,
    wrapper__price: string,
    wrapper__qty: string,
    wrapper__subtotal: string,
    wrapper__bottom: string,
    product__image: string,
    product__details: string,
    product__name: string,
    cartItem__removeItem: string
  }),
  item: object.isRequired,
  setActiveEditItem: func,
  setIsCartUpdating: func
}

export default Product

export const REMOVE_ITEM_MUTATION = gql`
  mutation removeItem($cartId: String!, $itemId: Int!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
      @connection(key: "removeItemFromCart") {
      cart {
        id
        ...CartPageFragment
      }
    }
  }
  ${ CartPageFragment }
`

export const UPDATE_QUANTITY_MUTATION = gql`
  mutation updateItemQuantity(
    $cartId: String!
    $itemId: Int!
    $quantity: Float!
  ) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
      }
    ) @connection(key: "updateCartItems") {
      cart {
        id
        ...CartPageFragment
      }
    }
  }
  ${ CartPageFragment }
`
