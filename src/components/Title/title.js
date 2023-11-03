import React from 'react'
import PropTypes from 'prop-types'

import classNames from './title.less'

const Title = props => {
  const {
    type,
    title,
    clickHandler
  } = props

  const TitleType = `${ type }`

  return (
    <TitleType
      className={ `${ classNames[type] }` }
      onClick={clickHandler}
    >
      <span>{ title }</span>
    </TitleType>
  )
}

Title.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default Title
