import React from 'react'

import classNames from './hexagon.less'

const Hexagon = props => {
  const { children } = props

  return (
    <div className={classNames.hexagon}>
      { children }
    </div>
  )
}

export default Hexagon
