import React, { Fragment } from 'react'
import pricingClasses from '../../Price/pricing.less'
import { useRealTimePricing } from '../../../talons/RealTimePricing/useRealTimePricing'
import { any, bool, oneOf, string } from 'prop-types'

export const realTimePrice = props => {
  const {
    crhData,
    label,
    labelSuffix,
    sku,
    type,
    visible,
    hideLoading
  } = props
  const { getRealTimePrice } = useRealTimePricing({
    realTimePricing: crhData,
    hideLoading
  })

  const realTimePrice = getRealTimePrice(sku, type)

  if (!realTimePrice || !realTimePrice.price) {
    return null
  }

  return (
    <Fragment>
      { visible
        ? <Fragment>
          <div className={ pricingClasses.priceRow }>
            <div className={ pricingClasses.priceLabel }>
              <span>{ label }</span>
              { labelSuffix
                ? <Fragment>
                    &nbsp;
                  { labelSuffix }
                  </Fragment>
                : <Fragment/>
              }:
            </div>
            <div className={ pricingClasses.priceRowWrapper }>
              { realTimePrice.price }
              {
                realTimePrice.extra
                  ? <span className={ pricingClasses.suffix }>
                    { realTimePrice.extra }
                  </span>
                  : ''
              }
            </div>
          </div>
        </Fragment>
        : <Fragment/>
      }
    </Fragment>
  )
}

realTimePrice.propTypes = {
  label: string,
  labelSuffix: any,
  sku: string.isRequired,
  type: oneOf(['base', 'complex', 'direct', 'tier']).isRequired,
  visible: bool.isRequired,
  hideLoading: bool
}

export default realTimePrice
