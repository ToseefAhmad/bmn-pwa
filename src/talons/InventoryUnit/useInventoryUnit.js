import React, { Fragment, useCallback } from 'react'
import { bool, shape, string } from 'prop-types'
import t from '@bmn/translate'

export const useInventoryUnit = props => {
  const { inventory_unit } = props

  const getMajorPackagingText = useCallback(() => {
    return (
      inventory_unit && inventory_unit.type
        ? <Fragment>
            { parseInt(inventory_unit.major_packaging_amount) }
              &nbsp;
            {
              inventory_unit.major_packaging_amount === 1
                ? t({ s: inventory_unit.unit_type.toUpperCase() })
                : t({ s: inventory_unit.unit_type.toUpperCase() + 'x' })
            }
          </Fragment>
        : <Fragment />
    )
  },[inventory_unit])

  return {
    getMajorPackagingText
  }
}

useInventoryUnit.propTypes = {
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
