import React from 'react'
import { any, arrayOf, number, oneOfType, shape, string } from 'prop-types'

import Dropdown from 'react-dropdown'
import defaultClasses from './select.less';

import { mergeClasses } from '@magento/venia-ui/lib/classify'

const Select = props => {
  const {
    data,
    defaultValue,
    placeholder,
    callback
  } = props
  const classes = mergeClasses(defaultClasses, props.classes)

  const callbackFunction = (evt) => {
    if (!callback) {
      return;
    }

    callback(evt.value)
  }

  return (
    <div className={ classes.select__wrapper }>
      <Dropdown
        className={ classes.select }
        controlClassName={ classes.select__control }
        placeholderClassName={ classes.select__placeholder }
        arrowClassName={ classes.select__arrow }
        options={ data }
        onChange={ (evt) => callbackFunction(evt) }
        value={ defaultValue }
        placeholder={ placeholder }
      />
    </div>
  )
}

Dropdown.propTypes = {
  classes: shape({
    select: string,
    select__wrapper: string,
    select__control: string,
    select__placeholder: string,
    select__arrow: string
  }),
  data: arrayOf(
    shape({
      value: oneOfType([ number, string ]).isRequired,
      label: string.isRequired,
      optional: any
    })
  )
}

export default Select
