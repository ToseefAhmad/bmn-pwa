import { useCallback } from 'react'
import { useCartContext } from '@magento/peregrine/lib/context/cart'
import { useApolloClient, useMutation } from '@apollo/client'
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing'
import { GET_PRODUCT_LISTING } from '../ProductListing/productListing'
import { refetchQueriesByName } from '../../../utils/refetchQueriesByName'

export const useCartActions = props => {
  const {
    mutations: { updateItemQuantityMutation },
    setIsCartUpdating
  } = props

  const apolloClient = useApolloClient()

  const [{ cartId }] = useCartContext()
  const [updateItemQuantity] = useMutation(updateItemQuantityMutation)

  const productListingTalonProps = useProductListing({
    queries: {
      getProductListing: GET_PRODUCT_LISTING
    }
  })

  const { items } = productListingTalonProps

  const emptyCart = useCallback(
    async () => {
      try {
        await updateItemQuantity({
          variables: { cartId }
        })
        await refetchQueriesByName(
          [
            'getCartDetails',
            'getItemCount',
            'getProductListing',
            'getPriceSummary'
          ],
          apolloClient
        )

      } catch (err) {
        // Do nothing. The error message is handled above.
        // console.error for local development debugging. Production mode hides this.
        console.error(err)
      }
    },
    [cartId, updateItemQuantity, items, setIsCartUpdating]
  )

  return {
    cartId,
    emptyCart
  }
}
