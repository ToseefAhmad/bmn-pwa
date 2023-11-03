import React, { Fragment, useEffect, useState } from 'react'
import CircleButton from '../CircleButton'
import classNames from './page-buttons.less'
import { bool, shape } from 'prop-types'

const ScrollToTopButton = props => {
  const { data } = props
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', function () {
      setIsVisible(window.pageYOffset > 300)
    })

    return () => {
      setIsVisible(false)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  let button = (<Fragment />)
  if (data.storeConfig.theme_page_buttons_back_to_top_button && isVisible) {
    button = (
      <CircleButton
        className={ classNames.pageUp }
        onClick={ scrollToTop }
      >
        <div className={ classNames.pageUpIcon }/>
      </CircleButton>
    )
  }

  return button
}

ScrollToTopButton.propTypes = {
  data: shape({
    storeConfig: shape({
      theme_page_buttons_back_to_top_button: bool
    })
  }).isRequired
}

export default ScrollToTopButton