import React from 'react'
import { func, object, string } from 'prop-types'
import classNames from './circle-button.less'
import { Link } from 'react-router-dom'

const CircleButton = props => {
  const {
    onClick,
    destination,
    className,
    children
  } = props

  return destination
    ? <Link
      to={ destination }
      className={ classNames.circleButton + ' ' + className }
    >
      { children }
    </Link>
    : <div
      onClick={ onClick }
      className={ classNames.circleButton + ' ' + className }
    >
      { children }
    </div>
}

CircleButton.propTypes = {
  onClick: func,
  destination: string,
  className: string,
  children: object,
}

export default CircleButton
