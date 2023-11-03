import React, { Fragment } from 'react'
import pricingClasses from '../../Price/pricing.less'
import { bool, shape, string } from 'prop-types'
import t from '@bmn/translate'
import { useInventoryUnit } from '../../../talons/InventoryUnit/useInventoryUnit'

export const majorPackaging = props => {
  const { inventory_unit } = props
  const { getMajorPackagingText } = useInventoryUnit({ inventory_unit })

  if (!inventory_unit || !inventory_unit.is_mandatory_packaging || !inventory_unit.major_packaging_unit) {
    return null
  }

  return (
    <Fragment>
      { inventory_unit.is_mandatory_packaging && inventory_unit.major_packaging_unit
        ? <Fragment>
            <div className={ pricingClasses.priceRow }>
              <div className={ pricingClasses.priceLabel }>
              <span>
                { t({ s: 'Content per' }) }
                &nbsp;
              </span>
                <span className={ pricingClasses.lowerCase }>
                { t({ s: inventory_unit.major_packaging_unit.toUpperCase() }) }
              </span>
                :
              </div>
              <div className={ pricingClasses.priceRowWrapper }>
                { getMajorPackagingText() }
              </div>
            </div>
          </Fragment>
        : <Fragment/>
      }
    </Fragment>
  )
}

majorPackaging.propTypes = {
  inventory_unit: shape({
    is_complex: bool,
    packaging_unit: string,
    packaging_amount: string,
    real_inventory_unit: string,
    unit_type: string,
    square_meter: string,
    price_per_unit: string,
    is_mandatory_packaging: string,
    major_packaging_amount: string,
    major_packaging_unit: string,
  })
}

export default majorPackaging
