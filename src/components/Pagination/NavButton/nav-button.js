import React, { Fragment } from 'react'
import { shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './nav-button.less'

const NavButton = props => {
  const {
    active,
    className,
    label,
    link
  } = props

  const classes = mergeClasses(defaultClasses, props.classes)

  return (
    <Fragment>
      {
        active
          ? <a
            className={ `${ classes.navButton } ${ classes[className] }` }
            href={ link }
          >
            { label }
          </a>
          : <Fragment/>
      }
    </Fragment>
  )
}

NavButton.propTypes = {
  classes: shape({
    navButton: string,
    prev: string,
    next: string
  })
}

export default NavButton
