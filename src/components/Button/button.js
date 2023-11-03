import React from 'react'
import { bool, func, string, node, oneOf } from 'prop-types'
import { Link } from 'react-router-dom'

import classNames from './button.less'

export const BUTTON_TYPE_ACTION = 'action'
export const BUTTON_TYPE_BUTTON = 'button'
export const BUTTON_TYPE_ACTION_EXTERNAL = 'action-external'
export const BUTTON_TYPE_NO_ACTION = 'no-action'
export const BUTTON_TYPE_SUBMIT = 'submit'

const Button = props => {
  const {
    type,
    cssClass,
    text,
    url,
    onClick,
    busy,
    disabled,
    children
  } = props

  const getButtonClassName = (cssClass) => {
    return 'button__' + cssClass
  }

  let button
  switch (type) {
    case BUTTON_TYPE_ACTION:
      button = <Link
        to={url}
        className={ `${ classNames.button } ${classNames[getButtonClassName(cssClass)]}` }
        data-disabled={ disabled }
        data-busy={ busy }
      >
        { children ? children : <span>{text}</span> }
      </Link>

      break

    case BUTTON_TYPE_ACTION_EXTERNAL:
      button = <a
        href={ url }
        title={ text }
        className={ `${ classNames.button } ${classNames[getButtonClassName(cssClass)]}` }
        onClick={ onClick }
        data-disabled={ disabled }
        data-busy={ busy }
      >
        { children ? children : <span>{text}</span> }
      </a>

      break

    case BUTTON_TYPE_BUTTON:
      button = <button
        className={ `${ classNames.button } ${classNames[getButtonClassName(cssClass)]}` }
        onClick={ onClick }
        data-disabled={ disabled }
        data-busy={ busy }
      >
        { children ? children : text }
      </button>

      break

    case BUTTON_TYPE_NO_ACTION:
      button = <span
        className={ `${ classNames.button } ${classNames[getButtonClassName(cssClass)]}` }
        onClick={ onClick }
        data-disabled={ disabled }
        data-busy={ busy }
      >
        { children ? children : text }
      </span>

      break

    default:
      button = <button
        type={ 'submit' }
        className={ `${ classNames.button } ${classNames[getButtonClassName(cssClass)]}` }
        onClick={ onClick }
        disabled={ disabled }
        data-busy={ busy }
      >
        { children ? children : text }
      </button>
  }

  return button
}

Button.propTypes = {
  type: oneOf([
    BUTTON_TYPE_ACTION,
    BUTTON_TYPE_ACTION_EXTERNAL,
    BUTTON_TYPE_NO_ACTION,
    BUTTON_TYPE_SUBMIT
  ]),
  cssClass: string,
  text: string,
  url: string,
  onClick: func,
  busy: bool,
  disabled: bool,
  children: node
}

export default Button
