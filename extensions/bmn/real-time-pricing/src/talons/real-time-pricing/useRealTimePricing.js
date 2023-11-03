import { string } from 'prop-types'
import { useQuery } from '@apollo/client'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge'

import DEFAULT_OPERATIONS from './real-time-pricing.gql'

export const useRealTimePricing = props => {
  const {
    productUrlKey
  } = props
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations)
  const { getProductRealTimePricing } = operations
  const { data: realTimePricingData } = useQuery(getProductRealTimePricing, {
    fetchPolicy: 'no-cache',
    skip: !productUrlKey,
    variables: {
      urlKey: productUrlKey
    }
  })
  const { products } = realTimePricingData || {}
  const { crh_data: crhData } = products || {}

  return {
     crhData
  }
}

useRealTimePricing.propTypes = {
  productUrlKey: string
}