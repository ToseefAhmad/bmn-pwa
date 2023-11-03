import React, { Fragment, useEffect, useRef, useState } from 'react'
import MenuRenderer from './MenuRenderer'
import menuClasses from './menu.less'

import HeaderLinks from '../Header/Panel/Links'

import { useQuery } from '@apollo/client'
import GET_MEGA_MENU_JSON from '../../queries/getMegaMenuJson.graphql'
import Mask from '@magento/venia-ui/lib/components/Mask/mask'
import Button from '../Button'
import t from '@bmn/translate'
import MobileTrigger from './MobileTrigger'

const Menu = () => {
  const { data, loading, error } = useQuery(GET_MEGA_MENU_JSON)
  const [maskState, setMaskState] = useState(false)
  const [openMenuItems, setOpenMenuItems] = useState([])
  const menuContainer = useRef(null)
  const breakpoint = window.matchMedia('(min-width: 1024px)')

  useEffect(() => {
    document.body.addEventListener('click', handleOutsideClick)

    return () => document.body.removeEventListener('click', handleOutsideClick)
  })

  const handleOutsideClick = e => {
    if (menuContainer.current
      && !menuContainer.current.contains(e.target)
      && (e.target.tagName === 'A' || e.target.parentNode.tagName === 'A')
    ) {
      closeMenu()
    }
  }

  const closeMenu = () => {
    document.getElementById(menuClasses.menuMobileToggle).checked = false
    resetOpenItems()
    setOpenMenuItems([])
  }

  const addOpenItemState = stateSetter => {
    let openItems = openMenuItems
    openItems.push(stateSetter)

    setOpenMenuItems(openItems)
  }

  const resetOpenItems = () => {
    if (breakpoint.matches) {

      // Because the desktop menu opens with css:hover, we need to remove pointerEvents to hide it again.
      // TODO: Open desktop/mobile menu by using states so both can be opened/closed by same functions etc.
      menuContainer.current.style.pointerEvents = 'none'
      setTimeout(() => {
        menuContainer.current.style.pointerEvents = ''
      }, 500)

    } else {
      openMenuItems.forEach(fn => fn(false))
      setOpenMenuItems([])
      document.getElementsByTagName('html')[0].setAttribute('data-scroll-lock', 'false')
    }
  }

  function changeMaskState(state) {
    if (breakpoint.matches) {
      setMaskState(state)
    }
  }

  if (loading || error || !data) {
    return null
  }

  const megaMenu = data.megaMenuJson.menu.map((children, index) =>
    <MenuRenderer
      key={ `menu-item-0-${ index }` }
      addAction={ addOpenItemState }
      resetAction={ resetOpenItems }
      item={ children }
      level={ 0 }
      index={ index }
    />
  )

  return <Fragment>
    <MobileTrigger onCloseCallback={ closeMenu }/>
    <div
      id={ 'menu-container' }
      ref={ menuContainer }
      data-element={ 'menu-container' }
      className={ menuClasses.menu__container }
      onMouseOver={ () => changeMaskState(true) }
      onMouseLeave={ () => changeMaskState(false) }
      onFocus={ () => changeMaskState(false) }
    >
      <Mask isActive={ maskState }/>
      { megaMenu }
      <div className={ menuClasses.menuLinks }>
        <HeaderLinks onLinkClick={ closeMenu }/>
        <Button
          key={ 1 }
          type={ 'action-external' }
          cssClass={ 'primary' }
          url={ 'customer/account' }
        >
        <span className={ menuClasses.userText }>
          <i className={ menuClasses.userIcon }/>
          <span>{ t({ s: 'My BMN' }) }</span>
        </span>
        </Button>
      </div>
    </div>
  </Fragment>
}

export default Menu
