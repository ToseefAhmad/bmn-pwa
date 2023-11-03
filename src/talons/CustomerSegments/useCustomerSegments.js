import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_SEGMENTS } from './customer-segment.gql';

/**
 * @param props
 * @returns {{segmentIsAvailable: (function(): boolean), getSaleableSegmentMessage: (function(): *|string), canAddToCart: ((function(): boolean)|*)}}
 */
export const useCustomerSegments = props => {
  const { data } = useQuery(GET_CUSTOMER_SEGMENTS, { fetchPolicy: 'cache-and-network' })
  const { customer } = data || {}
  const { product } = props

  /**
   * Check if add to cart must be prevented by customer segment.
   * @returns {boolean}
   */
  const canAddToCart = () => {
    if (customer && product) {
      const dataIsAvailable = (
        // data from saleable segments
        'saleable_segment' in product && 'segment_ids' in product.saleable_segment && product.saleable_segment.segment_ids.length > 0 &&
        // data from customer
        'segments' in customer && customer.segments.length > 0
      )

      if (dataIsAvailable) {
        // create new simple array from customer segments
        let customerSegmentIds = []
        for (let c = 0; c < customer.segments.length; c++) {
          customerSegmentIds.push(customer.segments[c].id)
        }

        for (let i = 0; i < product.saleable_segment.segment_ids.length; i++) {
          if (customerSegmentIds.indexOf(parseInt(product.saleable_segment.segment_ids[i])) !== -1) {
            return true
          }
        }

        return false
      }

      return true
    }

    return false
  }

  /**
   * Check if customer segment is available to prevent add to cart rendering before data is available.
   * @returns {boolean}
   */
  const segmentIsAvailable = () => {
    return !!(customer && customer.segments)
  }

  /**
   * Get message from configuration by customer segment.
   * @returns {string|string}
   */
  const getSaleableSegmentMessage = () => {
    return product && product.saleable_segment ? product.saleable_segment.message : ''
  }

  return {
    canAddToCart,
    segmentIsAvailable,
    getSaleableSegmentMessage
  }
}
