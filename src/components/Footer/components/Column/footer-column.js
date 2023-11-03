import React, { useState } from 'react'
import PropTypes, { shape, string } from 'prop-types'

import classNames from './footer-column.less'
import LinkList from '../../../LinkList/link-list'
import Title from '../../../Title/title'

const FooterColumn = props => {
  const { columnTitle, columnItems } = props
  const [isOpen, setIsOpen] = useState(false)

  function handleClick () {
    setIsOpen(!isOpen)
  }

  return (
    <div className={ (isOpen ? `${ classNames.tile } ${ classNames['tile__open'] }` : classNames.tile) }>
      <Title
        type={ 'h2' }
        title={ columnTitle }
        clickHandler={ handleClick }
      />
      <LinkList items={ columnItems } linkClass={ 'Link__gray' }/>
    </div>
  )
}

FooterColumn.propTypes = {
  columnTitle: PropTypes.string.isRequired,
  columnItems: PropTypes.array.isRequired,
  classes: shape({
    tile: string,
    tile__open: string,
    tileBody: string,
  }),
}

export default FooterColumn
