import React from 'react'
import { bool, node, shape, string } from 'prop-types'

import classes from './field.less'

const Field = props => {
  const {
    children,
    cssClass,
    id,
    label,
    required
  } = props

  return (
    <div className={ classes.field__container + `${(required) ? ' ' + classes.field__isRequired : ''}` + `${(cssClass) ? ' ' + cssClass : ''}`}>
      {
        label
          ? <label
            className={ classes.field__label }
            htmlFor={ id }
          >
            <span>
              { label }
            </span>
          </label>
          : ''
      }
      { children }
    </div>
  )
}

Field.propTypes = {
  children: node,
  cssClass: string,
  id: string,
  label: node,
  required: bool
}

export default Field
