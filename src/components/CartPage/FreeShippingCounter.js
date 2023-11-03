import React from 'react'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { useQuery } from '@apollo/client'
import reactStringReplace from 'react-string-replace'
import { bool, object, shape, string } from "prop-types"
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './freeShippingCounter.less'
import GET_FREIGHT_COST_CONFIG from '../../queries/getFreightCostConfig.graphql'
import { Price } from '@magento/peregrine'

const FreeShippingCounter = props => {
  let result = <></>
  const { data, loading, error } = useQuery(GET_FREIGHT_COST_CONFIG)
  const [{ currentUser }] = useUserContext()
  const classes = mergeClasses(defaultClasses, props.classes)

  if (loading || error || !data) {
    return result
  }

  if (currentUser.freight_cost_applied === true) {
    const { subtotal } = props
    const threshold = parseInt(data.storeConfig.checkout_freight_cost_freight_threshold)

    if (subtotal.value < threshold) {
      let message = data.storeConfig.checkout_freight_cost_freight_notice
      const mapping = {
        amount_left: threshold - subtotal.value,
        minimal_total: threshold
      }

      Object.keys(mapping).forEach((key, idx) => {
        message = reactStringReplace(message, '{{' + key + '}}', () => (
          <Price
            key={ idx }
            value={ mapping[key] }
            currencyCode={ subtotal.currency }
          />
        ))
      })

      result = <div className={ classes.fsc }>
        <i className={ classes.fsc__infoIcon }/>
        <div className={ classes.fsc__content }>
          { message }
        </div>
      </div>
    }
  }

  return result
}

FreeShippingCounter.propTypes = {
  subtotal: object.isRequired,
  data: shape({
    storeConfig: shape({
      checkout_freight_cost_freight_notice: string,
      checkout_freight_cost_freight_threshold: string
    })
  }),
  classes: shape({
    fsc: string,
    fsc__infoIcon: string,
    fsc__content: string
  }),
  currentUser: shape({
    freight_cost_applied: bool
  })
}

export default FreeShippingCounter
