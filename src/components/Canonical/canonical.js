import React, { Fragment } from 'react'
import { string, object } from 'prop-types'
import { Helmet } from 'react-helmet-async'

/**
 * Return canonical element
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Canonical = props => {
  const { href } = props

  if (!href) {
    return <Fragment />
  }

  return <Helmet>
    <link
      rel={ 'canonical' }
      href={ href }
    />
  </Helmet>
}

/**
 * Sets <link rel="prev" element
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const PreviousUrl = props => {
  const { pageControl } = props
  let previousUrl = <Fragment />

  if (pageControl.currentPage === 1) {
    return previousUrl
  }

  return <Helmet>
    <link
      rel={ 'prev' }
      href={ getUrl('prev', pageControl) }
    />
  </Helmet>
}

/**
 * Sets <link rel="next" element
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const NextUrl = props => {
  const { pageControl } = props
  let nextUrl = <Fragment />

  if (pageControl.currentPage === pageControl.totalPages) {
    return nextUrl
  }

  return <Helmet>
    <link
      rel={ 'next' }
      href={ getUrl('next', pageControl) }
    />
  </Helmet>
}

/**
 * Get URL for rel="prev/next" element
 * @param type
 * @param pageControl
 * @returns {string}
 */
const getUrl = (type, pageControl) => {
  let href = new URL(window.location.href);
  const newPageNumber = type === 'prev' ? pageControl.currentPage - 1 : pageControl.currentPage + 1
  href.searchParams.set('p', newPageNumber);

  return href.toString()
}

Canonical.propTypes = {
  href: string
}

PreviousUrl.propTypes = {
  pageControl: object
}

NextUrl.propTypes = {
  pageControl: object
}
