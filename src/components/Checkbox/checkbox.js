import React from 'react'
import { bool, func, shape, string } from 'prop-types'
import defaultClasses from './checkbox.less'
import { mergeClasses } from '@magento/venia-ui/lib/classify'

export const Checkbox = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    name,
    label,
    onClick,
    isChecked,
    isRequired
  } = props

  return <div
    className={ classes.checkbox__wrapper }
    onClick={ onClick }
  >
    <input
      type='checkbox'
      className={ classes.checkbox__input }
      name={ name }
      required={ isRequired }
      checked={ isChecked }
      onChange={ () => {} }
    />
    <label
      htmlFor={ name }
      className={ classes.checkbox__label }
    >
      <span>{ label }</span>
    </label>
  </div>
}

Checkbox.propTypes = {
  classes: shape({
    checkbox__wrapper: string,
    checkbox__input: string,
    checkbox__label: string,
  }),
  name: string.isRequired,
  label: string.isRequired,
  onClick: func,
  isChecked: bool,
  isRequired: bool
}

Checkbox.defaultProps = {
  onClick: () => {},
  isChecked: false,
  isRequired: false
}

export default Checkbox
