import { useRealTimePricing } from '../../../real-time-pricing/useRealTimePricing'

export default (original) => {
  return function useProduct(props, ...restArgs) {
    const { product, ...defaultReturnData } = original(
      props,
      ...restArgs
    )

    const { url_key: urlKey } = product || {}
    const { crhData } = useRealTimePricing({productUrlKey: urlKey})

    return {
      ...defaultReturnData,
      product: {
        ...product,
        crhData
      }
    }
  }
}
