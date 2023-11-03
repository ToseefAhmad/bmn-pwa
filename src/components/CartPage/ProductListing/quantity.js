import React, { Fragment } from 'react'
import { Form, useFieldState } from 'informed'
import { func, number, string } from 'prop-types'
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity'
import TextInput from '../../TextInput'
import Button, { BUTTON_TYPE_ACTION_EXTERNAL } from '../../Button'
import t from '@bmn/translate'
import classNames from './quantity.less'

export const QuantityFields = props => {
  const {
    initialValue,
    itemId,
    min,
    onChange
  } = props

  const talonProps = useQuantity({
    initialValue,
    min,
    onChange
  })

  const {
    handleBlur,
    maskInput
  } = talonProps

  const { value: quantity } = useFieldState('quantity');

  return (
    <div className={ classNames.root }>
      <TextInput
        aria-label="Item Quantity"
        field="quantity"
        id={ itemId }
        inputMode="numeric"
        mask={ maskInput }
        min={ min }
        pattern="[0-9]*"
      />
      {
        (quantity && quantity !== initialValue) ? <Button
            cssClass={ 'primary-cartupdate' }
            type={ BUTTON_TYPE_ACTION_EXTERNAL }
            onClick={ handleBlur }
          >
            <span>{ t({ s: 'Update' }) }</span>
          </Button>
          : <Fragment/>
      }
    </div>
  )
}

const Quantity = props => {
  return (
    <Form
      initialValues={ {
        quantity: props.initialValue
      } }
    >
      <QuantityFields { ...props } />
    </Form>
  )
}

Quantity.propTypes = {
  initialValue: number,
  itemId: string,
  label: string,
  min: number,
  onChange: func
}

Quantity.defaultProps = {
  label: 'Quantity',
  min: 0,
  initialValue: 1,
  onChange: () => {
  }
}

QuantityFields.defaultProps = {
  min: 0,
  initialValue: 1,
  onChange: () => {
  }
}

export default Quantity
