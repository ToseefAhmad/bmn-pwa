import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { bool, func, node, number, string } from 'prop-types'
import classNames from './read-more.less'
import t from '@bmn/translate'
import ReadMoreAction from './action'
import { useWindowSize } from '@magento/peregrine'

/**
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const ReadMore = props => {
  const {
    children,
    callback = () => {},
    maxVisibleHeight = 300,
    readMoreAsGradient = false,
    readMoreLabel = t({ s: 'Read more' }),
    readLessLabel = t({ s: 'Read less' }),
    mobileOnly = false,
    mobileResolutionThreshold = 1023
  } = props

  const [isActive, setIsActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const windowSize = useWindowSize()
  const rmWrapper = useRef(null)

  /**
   * Whenever the rmWrapper.current changes (e.g. more content loaded into this element),
   * execute the readMore logic again.
   */
  useLayoutEffect(() => {
    if (rmWrapper && rmWrapper.current) {
      readMoreActiveStateHandler()
    }
  }, [rmWrapper])

  /**
   * Monitors the screenWidth, executes the readMore active state logic.
   * Some elements have enough height on desktop resolutions, thus making readMore logic unnecessary.
   * However, when your screen becomes smaller (e.g. tablet landscape > portrait) readMore logic should be triggered.
   */
  useEffect(() => {
    readMoreActiveStateHandler()
  }, [windowSize, children])

  /**
   * Sets the active state on the readMore container.
   * Only active readMore containers have the correct CSS that allows users to interact.
   */
  const readMoreActiveStateHandler = useCallback(() => {
    const elementHeight = rmWrapper.current
      ? rmWrapper.current.clientHeight
      : 0

    const desiredActiveState = elementHeight >= maxVisibleHeight && !isOpen
      && (mobileOnly === false || (mobileOnly === true && window.innerWidth <= mobileResolutionThreshold))

    setIsActive(desiredActiveState)
  }, [
    rmWrapper,
    setIsActive,
    maxVisibleHeight,
    isOpen,
    mobileOnly,
    mobileResolutionThreshold
  ])

  /**
   * Toggles content visibility (open or closed). Also calls the callback (props) for extended logic possibilities.
   */
  const toggleContentVisibility = () => {
    setIsOpen(!isOpen)
    callback()
  }

  /**
   * Creates the right container class based on active and open state as well as mobileOnly props flag.
   *
   * @returns {string}
   */
  const getContainerClass = () => {
    let containerClass = isActive
      ? `${ classNames.rm__container } ${ classNames.rm__active }`
      : `${ classNames.rm__container }`
    if (isOpen) containerClass += ` ${ classNames.contentVisible }`
    if (mobileOnly) containerClass += ` ${ classNames.mobileOnly }`

    return containerClass
  }

  /**
   * Returns the necessary wrapper styles based on the active and open states.
   *
   * @returns {{maxHeight: number}}
   */
  const getWrapperStyles = () => {
    return isActive && !isOpen
      ? { maxHeight: maxVisibleHeight }
      : { }
  }

  /**
   * Creates the right class for the showContent action, based on the readMoreAsGradient props flag.
   *
   * @returns {string}
   */
  const getShowContentClass = useCallback(() => {
    return readMoreAsGradient
      ? `${ classNames.rm__action } ${ classNames.showContent } ${ classNames.asGradient }`
      : `${ classNames.rm__action } ${ classNames.showContent }`
  }, [readMoreAsGradient])

  return <div className={ getContainerClass() }>
    <div
      className={ classNames.rm__wrapper }
      style={ getWrapperStyles() }
      ref={ rmWrapper }
    >
      { children }
    </div>
    <div className={ classNames.rm__actions }>
      <ReadMoreAction
        callback={ toggleContentVisibility }
        isVisible={ isOpen === false }
        className={ getShowContentClass() }
        label={ readMoreLabel }
      />
      <ReadMoreAction
        callback={ toggleContentVisibility }
        isVisible={ isOpen === true }
        className={ `${ classNames.rm__action } ${ classNames.minimizeContent }` }
        label={ readLessLabel }
      />
    </div>
  </div>
}

ReadMore.propTypes = {
  children: node.isRequired,
  callback: func,
  maxVisibleHeight: number,
  readMoreAsGradient: bool,
  readMoreLabel: string,
  readLessLabel: string,
  mobileOnly: bool,
  mobileResolutionThreshold: number
}

export default ReadMore

