import React, { useEffect, useRef } from 'react'
import { bool, shape, string } from 'prop-types'

import AlgoliaSearch from '../Search/Algolia/AlgoliaSearch'
import Menu from '../Menu/Menu'
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './header.less'
import Logo from '../Logo'
import Links from './Panel/Links'
import Additional from './additional'
import { Link } from 'react-router-dom'
import resourceUrl from '@magento/peregrine/lib/util/makeUrl'
import * as windowHelper from '../../utils/windowHelper'

const Header = props => {
  const {
    hasBeenOffline,
    isOnline
  } = props

  const docBody = document.body
  const header = useRef(null)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (windowHelper.isDesktop() === false) {
        if (windowHelper.hasLock() === false && windowHelper.hasOffset() === true) {
          windowHelper.removeOffset()
          docBody.removeAttribute('data-sticky')
        }

        return null
      }

      if (window.pageYOffset > 67 && windowHelper.hasLockOrOffset() === false) {
        windowHelper.setOffset(150)
        docBody.setAttribute('data-sticky', '1')
      } else if (window.pageYOffset <= 67 && windowHelper.hasLock() === false) {
        windowHelper.removeOffset()
        docBody.removeAttribute('data-sticky')
      }
    })
  }, [windowHelper, docBody])

  const classes = mergeClasses(defaultClasses, props.classes)

  return (
    <header
      ref={ header }
      className={ classes.root }
    >
      <div
        id={ 'header-inner' }
        className={ defaultClasses.header__inner }
      >
        <Link
          className={ defaultClasses.logoLink__desktop }
          to={ resourceUrl('/') }
        >
          <Logo classes={ { logo: defaultClasses.logo } }/>
        </Link>
        <div className={ defaultClasses.logoLink__mobile }>
          <Link to={ resourceUrl('/') }>
            <Logo
              height={ 37 }
              classes={ { logo: defaultClasses.logo } }
            />
          </Link>
        </div>
        <div className={ defaultClasses.links }>
          <Links/>
        </div>
        <Menu/>
        <OnlineIndicator
          hasBeenOffline={ hasBeenOffline }
          isOnline={ isOnline }
        />
        <div className={ classes.searchActions }>
          <AlgoliaSearch/>
        </div>
        <Additional/>
      </div>
    </header>
  )
}

Header.propTypes = {
  classes: shape({
    closed: string,
    logo: string,
    open: string,
    primaryActions: string,
    secondaryActions: string,
    toolbar: string
  }),
  searchOpen: bool
}

export default Header
