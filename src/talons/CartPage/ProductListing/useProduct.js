import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApolloClient, useMutation } from '@apollo/client'
import { useAppContext } from '@magento/peregrine/lib/context/app'
import { useCartContext } from '@magento/peregrine/lib/context/cart'
import { refetchQueriesByName } from '../../../utils/refetchQueriesByName'
import { useDataLayerConfig } from '../../../context/gtm'

export const useProduct = props => {
  const {
    item,
    mutations: { removeItemMutation, updateItemQuantityMutation },
    setActiveEditItem,
    setIsCartUpdating
  } = props

  const apolloClient = useApolloClient()

  const flatProduct = flattenProduct(item)

  const [
    removeItem,
    { loading: removeItemLoading, called: removeItemCalled }
  ] = useMutation(removeItemMutation)

  const [
    updateItemQuantity,
    {
      loading: updateItemLoading,
      error: updateError,
      called: updateItemCalled
    }
  ] = useMutation(updateItemQuantityMutation)

  useEffect(() => {
    if (updateItemCalled || removeItemCalled) {
      // If a product mutation is in flight, tell the cart.
      setIsCartUpdating(updateItemLoading || removeItemLoading)
    }

    // Reset updating state on unmount
    return () => setIsCartUpdating(false)
  }, [
    removeItemCalled,
    removeItemLoading,
    setIsCartUpdating,
    updateItemCalled,
    updateItemLoading
  ])

  const [{ cartId }] = useCartContext()
  const [{ drawer }, { toggleDrawer }] = useAppContext()

  const [isFavorite, setIsFavorite] = useState(false)

  const updateItemErrorMessage = useMemo(() => {
    if (!updateError) return null

    if (updateError.graphQLErrors) {
      // Apollo prepends "GraphQL Error:" onto the message,
      // which we don't want to show to an end user.
      // Build up the error message manually without the prepended text.
      return updateError.graphQLErrors
      .map(({ message }) => message)
      .join(', ')
    }

    // A non-GraphQL error occurred.
    return updateError.message
  }, [updateError])

  const handleToggleFavorites = useCallback(() => {
    setIsFavorite(!isFavorite)
  }, [isFavorite])

  const handleEditItem = useCallback(() => {
    setActiveEditItem(item)
    toggleDrawer('product.edit')
  }, [item, setActiveEditItem, toggleDrawer])

  useEffect(() => {
    if (drawer === null) {
      setActiveEditItem(null)
    }
  }, [drawer, setActiveEditItem])

  const handleRemoveFromCart = useCallback(async () => {
    try {
      const { error } = await removeItem({
        variables: {
          cartId,
          itemId: item.id
        }
      })

      refetchQueriesByName(
        [
          'getCartDetails',
          'getItemCount',
          'getProductListing',
          'getPriceSummary'
        ],
        apolloClient
      )
      if (error) {
        throw error
      }
    } catch (err) {
      // TODO: Toast?
      console.error('Cart Item Removal Error', err)
    }
  }, [cartId, item.id, removeItem])

  const handleUpdateItemQuantity = useCallback(
    async quantity => {
      try {
        await updateItemQuantity({
          variables: {
            cartId,
            itemId: item.id,
            quantity
          }
        })
      } catch (err) {
        // Do nothing. The error message is handled above.
      }
    },
    [cartId, item.id, updateItemQuantity]
  )

  const dataLayerConfig = useDataLayerConfig()
  useEffect(() => {
    // We can use dataLayer because we have access to the window.
    if (flatProduct && window.dataLayer && removeItemCalled) {
      window.dataLayer.push(dataLayerConfig.removeFromCart(flatProduct))
    }
  }, [item, dataLayerConfig, removeItemCalled])

  return {
    handleEditItem,
    handleRemoveFromCart,
    handleToggleFavorites,
    handleUpdateItemQuantity,
    isEditable: !!flatProduct.options.length,
    isFavorite,
    product: flatProduct,
    updateItemErrorMessage
  }
}

const flattenProduct = item => {
  const {
    configurable_options: options = [],
    prices,
    product,
    quantity
  } = item

  const { price, row_total } = prices
  const { value: unitPrice, currency } = price
  const { value: rowPrice } = row_total

  const {
    name,
    small_image,
    stock_status: stockStatus,
    url_key: urlKey,
    url_suffix: urlSuffix
  } = product
  const { url: image } = small_image

  return {
    currency,
    image,
    name,
    options,
    quantity,
    stockStatus,
    unitPrice,
    urlKey,
    urlSuffix,
    rowPrice
  }
}
