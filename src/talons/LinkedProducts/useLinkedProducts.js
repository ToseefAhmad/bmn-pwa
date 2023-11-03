import GET_LINKED_PRODUCT_DATA from '../../queries/getLinkedProduct.graphql'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import GET_CRH_DATA from '../../queries/getCrhData.graphql'

export const useLinkedProducts = props => {
  const { productSkus, type } = props
  const [isLoading, setIsLoading] = useState(false)
  const { data, loading } = useQuery(GET_LINKED_PRODUCT_DATA, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      skus: productSkus
    }
  })
  const [fetchCrhData, { data: fetchedCrhData, loading: crhDataLoading }] = useLazyQuery(GET_CRH_DATA)

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  const products = useMemo(() => {
    const typeName = type + '_products'
    return (data && data.hasOwnProperty('linkedProduct'))
      ? data.linkedProduct.items.map(item => item[typeName]).flat(1).filter(
        (product, index, allProducts) => {
          return allProducts.indexOf(product) === index
        })
      : []
  }, [data, type])

  const crhData = useMemo(() => {
    const skus = products.map(product => product.sku).flat(1)
    fetchCrhData({ variables: { skus: skus } })

    const data = fetchedCrhData

    return (data && data.hasOwnProperty('crhData'))
      ? data.crhData.crh_data
      : false
  }, [
    fetchCrhData,
    fetchedCrhData,
    products
  ])

  return {
    crhData,
    isLoading,
    products
  }
}