import React from 'react'
import { func, string } from 'prop-types'
import t from '@bmn/translate'

import { useCartActions } from './useCartActions'
import buttonClasses from '../../Button/button.less'
import cartActionClasses from './cartActions.less'

import gql from 'graphql-tag'

export const EMPTY_CART_ITEMS = gql`
mutation emptyCart($cartId: String!) {
  emptyCart(cart_id: $cartId)
  {
    email
  }
}
`

export const DeleteAllAction = props => {
  const {
    setIsCartUpdating,
    label = t({ s: 'Empty cart' })
  } = props

  const cartActionTalonProps = useCartActions({
    mutations: { updateItemQuantityMutation: EMPTY_CART_ITEMS },
    setIsCartUpdating
  })

  const { emptyCart } = cartActionTalonProps

  return <button
    className={ `${ buttonClasses.button__link } ${ cartActionClasses.button__removeAll }` }
    onClick={ emptyCart }
  >
    <span>{ label }</span>
  </button>
}

DeleteAllAction.props = {
  setIsCartUpdating: func.isRequired,
  label: string
}

export default DeleteAllAction
