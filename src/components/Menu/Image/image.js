import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import resourceUrl from '@magento/peregrine/lib/util/makeUrl'

const Image = props => {
  const { src, alt, url, target = '_self' } = props
  
  let image = <img
    src={src}
    alt={alt}
    title={alt}
  />
  
  if (url) {
    if (target === '_self') {
      image = <Link to={ resourceUrl(url) }>
        {image}
      </Link>
    } else {
      image = <a
        href={url}
        title={alt}
      >
        {image}
      </a>
    }
  }
  
  return (
    image
  )
}



Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  url: PropTypes.string,
  target: PropTypes.string
}

export default Image
