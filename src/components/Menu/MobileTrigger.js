import React, { Fragment } from 'react'
import menuClasses from './menu.less'
import { useWindowSize } from '@magento/peregrine'
import { func } from 'prop-types'

const MobileTrigger = props => {
  const { onCloseCallback } = props
  const windowSize = useWindowSize()
  const isMobile = windowSize.innerWidth < 1024
  const html = document.getElementsByTagName('html')[0]

  if (isMobile) {
    html.setAttribute('data-scroll-lock', 'false')
  }

  return <Fragment>
    <input
      id={ menuClasses.menuMobileToggle }
      type={ 'checkbox' }
      onChange={ e => {
        if (e.target.checked === false) {
          onCloseCallback()
        }
        html.setAttribute('data-scroll-lock', e.target.checked.toString())
      } }
    />
    <label
      className={ menuClasses.menuMobileLabel }
      id={ menuClasses.menuMobileLabel }
      htmlFor={ menuClasses.menuMobileToggle }
    >
      <span
        className={ menuClasses.menuMobileToggle }
        onClick={ props.onClick }>
        <span className={ menuClasses.menu__hamburgerStripe }/>
        <span className={ menuClasses.menu__hamburgerStripe }/>
        <span className={ menuClasses.menu__hamburgerStripe }/>
      </span>
    </label>
  </Fragment>
}

MobileTrigger.propTypes = {
  onCloseCallback: func
}

export default MobileTrigger
