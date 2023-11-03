import React from 'react'
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import classNames from './link-list.less'

const LinkList = props => {
  const { items, linkClass } = props

  const linkList = items.map((link, key) => {
    let LinkBody = <Link to={ link.url }>
      <span>{ link.title }</span>
    </Link>

    if (link.is_external_url === 'on' || link.opens_in_new_page === 'on') {
      let target = link.opens_in_new_page === 'on' ? '_blank' : '_self'

      LinkBody = <a href={ link.url } target={ target }>
        <span>{ link.title }</span>
      </a>
    }

    return (
      <li
        key={ key }
        className={ `${ classNames.Link } ${ classNames[linkClass] }` }
      >
        { LinkBody }
      </li>
    )
  })

  return (
    <ul className={classNames.List}>
      {linkList}
    </ul>
  )
}

LinkList.propTypes = {
  items: PropTypes.array.isRequired,
  linkClass: PropTypes.string,
}

export default LinkList
