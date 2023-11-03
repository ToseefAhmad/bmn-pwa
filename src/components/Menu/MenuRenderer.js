import React, { useEffect, useRef, useState } from 'react'
import Image from './Image'

import MenuStyle from './menu.less'
import { Link } from 'react-router-dom'
import resourceUrl from '@magento/peregrine/lib/util/makeUrl'
import { any, func, number, shape, string } from 'prop-types'

const MenuRenderer = React.memo((props) => {
  const {
    item,
    level,
    addAction,
    resetAction,
    index,
  } = props

  const {
    url,
    title,
    hybrid,
    children,
    image_url
  } = item

  const [menuItemOpen, setMenuItemOpen] = useState(false)
  const breakpoint = window.matchMedia('(max-width: 1023px)')
  const submenuElement = useRef(null)
  const menuElement = useRef(null)


  useEffect(() => {
    if (menuElement && menuElement.current && level === 1) {
      menuElement.current.addEventListener('mouseenter', event => calculateSubmenuWidth(event, level))

      window.addEventListener('scroll', function() {
        if (menuElement.current) {
          const isMenuActive = menuElement.current.getAttribute('data-active')
          if (isMenuActive === '1') {
            menuElement.current.dispatchEvent(new Event('mouseenter'))
          }
        }
      })
    }
  }, [level, menuElement])

  // TODO: Close mobile menu when breakpoint.matches is false (?)
  const triggerClick = (e, level = false, hasChildren = true) => {
    if (breakpoint.matches) {
      if (level <= 1) {
        addAction(setMenuItemOpen)
        if (hasChildren) {
          e.preventDefault()
        }

        const menuContainer = document.getElementById('menu-container')

        level >= 0
          ? menuContainer.setAttribute('data-level-open', level.toString())
          : menuContainer.removeAttribute('data-level-open')

        setMenuItemOpen(!menuItemOpen)
      }

      if (level >= 2 || !hasChildren) {
        resetAction()
        document.getElementById(MenuStyle.menuMobileToggle).checked = false
      }
    } else {
      resetAction()
    }
  }

  let childrenElements = []
  if (children) {
    childrenElements = children.map((child, index) => {
      return <MenuRenderer
        key={ `menu-item-${ level }-${ index }` }
        addAction={ addAction }
        resetAction={ resetAction }
        item={ child } level={ level + 1 }
      />
    })
  }

  const backElement = level <= 1
    ? <div
      className={ MenuStyle.backButton }
      onClick={ e => triggerClick(e, level - 1) }
    >
      <span>
        { title }
      </span>
    </div>
    : null

  // TODO: Move each menu option to separate component. **/
  // Default link
  let element = <Link
    className={ MenuStyle.itemTitle }
    to={ url ? '/' + resourceUrl(url) : '' }
    onClick={ event => triggerClick(event, level, childrenElements.length > 0) }
  >
    <span>{ title }</span>
  </Link>

  // No link
  if (level === 0 || level > 0 && !url) {
    element = <span
      className={ MenuStyle.itemTitle }
      onClick={ event => triggerClick(event, level, childrenElements.length > 0) }
    >
      <span>{ title }</span>
    </span>
  }

  // External link from url input
  if (url && url.indexOf('http') >= 0) {
    element = <a
      title={ title }
      href={ url }
      className={ MenuStyle.itemTitle }
      target="_blank"
    >
      { title }
    </a>
  }

  // check if reload is necessary for hybrid construction
  if (parseInt(hybrid) === 1) {
    element = <a
      title={ title }
      href={ url }
      className={ MenuStyle.itemTitle }
    >
      { title }
    </a>
  }

  // Image
  if (image_url) {
    element = <Image
      src={ image_url }
      alt={ item.hasOwnProperty('alt') ? item.hasOwnProperty('alt') : '' }
      url={ url }
      target={ url.indexOf('http') >= 0 ? '_blank' : '_self' }
    />
  }

  /**
   * Calculate submenu width on desktop to align with content
   * @param event
   * @param level
   */
  const calculateSubmenuWidth = (event, level) => {
    if (level === 1) {
      let width = ''

      if (!breakpoint.matches) {
        const element = event.target
        // elements
        const menuContainer = document.getElementById('menu-container')
        const headerInner = document.getElementById('header-inner')

        // header inner styles
        const headerInnerStyle = getComputedStyle(headerInner)
        const headerInnerPaddingLeft = parseFloat(headerInnerStyle.paddingLeft)
        const headerInnerPaddingRight = parseFloat(headerInnerStyle.paddingRight)

        // calculated inner width without paddings
        const headerInnerWidth = headerInner.clientWidth - headerInnerPaddingLeft - headerInnerPaddingRight

        // menu container styles
        const menuContainerStyle = getComputedStyle(menuContainer)
        const menuContainerMarginLeft = parseFloat(menuContainerStyle.marginLeft)

        // header inner X position
        const headerInnerPosition = headerInner.getBoundingClientRect().left

        // submenu position
        const submenuPosition = (element.getBoundingClientRect().left - headerInnerPosition) + element.clientWidth

        // calculate submenu width
        const submenuWidth = ((headerInnerWidth - menuContainerMarginLeft) - submenuPosition) + (headerInnerPaddingLeft + menuContainerMarginLeft)

        width = submenuWidth + 'px'
      }

      submenuElement.current.style.width = width
    }
  }

  const setActiveItem = (value) => {
    if (menuElement && menuElement.current) {
      menuElement.current.setAttribute('data-active', value)
    }
  }

  return (
    <div
      data-hovered={ menuItemOpen }
      data-has-children={ children ? children.length > 0 : false }
      className={ `${ MenuStyle[`level-${ level }`]} ${ MenuStyle[`parent-${ index }`] }` }
      ref={ menuElement }
      onMouseOver={ () => setActiveItem('1') }
      onMouseLeave={ () => setActiveItem('0')  }
    >
      { element ? element : '' }
      <div
        ref={ submenuElement }
        className={ MenuStyle[`child-level-${ level }`] }
      >
        { backElement }
        { childrenElements }
      </div>
    </div>
  )
})

MenuRenderer.propTypes = {
  item: shape({
    title: string.isRequired,
    image_url: string,
    url: string,
    type: string,
    hybrid: string,
    children: any
  }),
  level: number,
  addAction: func,
  resetAction: func,
  index: number
}

export default MenuRenderer
