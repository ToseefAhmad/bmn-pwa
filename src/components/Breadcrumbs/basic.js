import React, { Fragment } from 'react'
import { arrayOf, number, shape, string } from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './breadcrumbs.less'
import { Link } from 'react-router-dom'

/**
 * A simple breadcrumb component since the Breadcrumb component in venia-ui is
 * specifically built for product page crumbs.
 *
 * @constructor
 */
const Breadcrumb = props => {
  const { crumbs } = props
  const classes = mergeClasses(defaultClasses, props.classes)

  const homeCrumb = <Fragment>
    <Link
      className={ classes.link }
      to={ `/` }
    >
      { 'Home' }
    </Link>
  </Fragment>

  return (
    <div className={classes.root}>
      { homeCrumb }
      {
        crumbs.map((crumb, key) =>
          <Fragment key={ key }>
            <span className={ classes.divider }>/</span>
            <Link
              className={ classes.link }
              to={ `/${crumb.url_key}` }
            >
              { crumb.title }
            </Link>
          </Fragment>
        )
      }
    </div>
  )
}

Breadcrumb.propTypes = {
  crumbs: arrayOf(shape({
    url_key: string.isRequired,
    title: string.isRequired,
    url_path: string
  }))
}

export default Breadcrumb
