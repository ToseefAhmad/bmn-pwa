import React from 'react'
import Button, { BUTTON_TYPE_ACTION_EXTERNAL } from '../../Button'
import t from '@bmn/translate'
import { string } from 'prop-types'

export const ContinueToCheckoutAction = props => {
  const {
    cssClass = 'primary',
    label = 'Continue to checkout',
    quoteId
  } = props

  return (
    <Button
      cssClass={ cssClass }
      type={ BUTTON_TYPE_ACTION_EXTERNAL }
      onClick={ () => { location.assign(`/checkout?quote=${ quoteId }`) } }
    >
      <span>{ t({ s: label }) }</span>
    </Button>
  )
}

ContinueToCheckoutAction.propTypes = {
  cssClass: string,
  label: string,
  quoteId: string.isRequired
}

ContinueToCheckoutAction.defaultProps = {
  cssClass: 'primary',
  label: 'Continue to checkout'
}

export default ContinueToCheckoutAction
