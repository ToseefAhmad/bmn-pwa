import React from 'react'
import t from '@bmn/translate'
import RequisitionListMenu from '../../RequisitionList/requisition-list-menu'
import { useCartActions } from './useCartActions'
import { EMPTY_CART_ITEMS } from './emptyCart'

export const TransformToRequisitionListAction = props => {
  const {
    label = 'Save cart for later',
    items,
    setIsCartUpdating
  } = props

  const cartActionTalonProps = useCartActions({
    mutations: { updateItemQuantityMutation: EMPTY_CART_ITEMS },
    setIsCartUpdating
  })

  const { emptyCart } = cartActionTalonProps
  const canApplyToReqList = !!items.length

  return (
    <>
    { canApplyToReqList
      ? <RequisitionListMenu
          type={ 'tertiary-button' }
          additionalActions={ { emptyCart } }
          text={ t({ s: label }) }
          products={ items }
          redirectAfterUserAction={ false }
        />
      : <></>
    }
    </>
  )
}

export default TransformToRequisitionListAction
