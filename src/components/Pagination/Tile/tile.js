import React from 'react'
import { bool, number, shape, string } from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './tile.less'

const Tile = props => {
  const { isActive, number, link } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const tileClass = isActive ? classes.tile__active : classes.tile

  return (
    <a href={link} className={ tileClass }>
        { number }
    </a>
  )
}

Tile.propTypes = {
  classes: shape({
    tile: string,
    tile__active: string
  }),
  link: string,
  isActive: bool,
  number: number
}

export default Tile
