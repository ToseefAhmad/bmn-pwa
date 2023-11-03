import React from 'react'
import { bool, func, string } from 'prop-types'

export const ReadMoreAction = props => {
  const {
    callback,
    isVisible,
    className,
    label
  } = props

  return isVisible
    ? <div
      className={ className }
      onClick={ callback }
    >
      <span>{ label }</span>
    </div>
    : null
}

ReadMoreAction.propTypes = {
  callback: func.isRequired,
  isVisible: bool.isRequired,
  className: string.isRequired,
  label: string.isRequired
}

export default ReadMoreAction
