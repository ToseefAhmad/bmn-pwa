import React, { useEffect } from 'react'

import { useLazyQuery } from '@apollo/client';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql'
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const CartQty = () => {
  const [{ cartId }] = useCartContext();
  const [getItemCount, { data }] = useLazyQuery(GET_ITEM_COUNT_QUERY);

  useEffect(() => {
    if (cartId) {
      getItemCount({ variables: { cartId } });
    }
  }, [cartId, getItemCount]);

  return data ? data.cart.total_quantity : 0
}

export default CartQty
