import React from 'react'
import PropTypes from 'prop-types'

import classNames from './title.less'

const FakeTitle = props => {
  const {
    type,
    title,
    extraClasses,
    clickHandler
  } = props

  const className = extraClasses
    ? `${classNames[type]}` + ' ' + extraClasses.toString().replace(',', ' ')
    : `${classNames[type]}`

  return (
    <span className={ className }>
      <span onClick={ clickHandler }>{ title }</span>
    </span>
  )
}

FakeTitle.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  extraClasses: PropTypes.array,
  clickHandler: PropTypes.func
}

export default FakeTitle
