import React, { Fragment, useCallback, useEffect, useState } from 'react'
import defaultClasses from './carousel.less'
import { tns } from 'tiny-slider/src/tiny-slider.module'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { useWindowSize } from '@magento/peregrine'

// Tiny slider default styles.
import 'tiny-slider/dist/tiny-slider.css'

const TinySlider = props => {
  const {
    listRef,
    children,
    settings,
    showButtons,
    type,
    randomId,
    thumbs
  } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const [slider, setSlider] = useState(null)
  const windowSize = useWindowSize()
  const [showArrows, setShowArrows] = useState(false)

  useEffect(() => {
    if (!slider && listRef.current.children.length) {
      setSlider(
        tns({
          ...settings,
          container: '#slider-' + randomId
        })
      )
    }
  }, [slider, listRef, settings, type])

  useEffect(() => {
    if (slider && showButtons) {
      setShowArrows(
        getInfo().items < listRef.current.children.length
      )
    }
  }, [children, windowSize, showButtons, showArrows, slider, listRef])

  const getInfo = useCallback(() => {
    if (slider !== null) {
      return slider.getInfo()
    }

    return {}
  }, [slider])

  const goTo = dir => {
    slider.goTo(dir)
    toggleActiveClass()
  }

  const toggleActiveClass = () => {
    if (thumbs && slider !== null) {
      let currentItem = getInfo().index > getInfo().navItems.length
        ? 0
        : getInfo().index - 1
      const previousItem = getInfo().indexCached - 1

      if (currentItem < 0) {
        currentItem = getInfo().navItems.length - 1
      }
      if (getInfo().navItems[previousItem]) {
        getInfo().navItems[previousItem].classList.remove(classes.active)
      }
      if (getInfo().navItems[currentItem]) {
        getInfo().navItems[currentItem].classList.add(classes.active)
      }
    }
  }

  return (
    <div>
      { children }
      { showArrows
        ? <Fragment>
          <div className={ classes.buttons__wrapper + ' ' + defaultClasses[type] }>
            <button
              className={ classes.button__prev }
              onClick={ () => goTo('prev') }
            >
            </button>
            <button
              className={ classes.button__next }
              onClick={ () => goTo('next') }
            >
            </button>
          </div>
        </Fragment>
        : <Fragment/>
      }

      { thumbs
        ? <Fragment>
          <ul
            id={ settings.navContainer.replace('#', '') }
            className={ classes.thumbs }
          >
            { children.props.children.length > 1
              ? children.props.children.map(
                (child, index) => {
                  if (index === 0) {
                    return <li
                      key={ index }
                      onClick={ () => {
                        toggleActiveClass()
                      } }
                      className={ classes.active }
                    >
                      { child }
                    </li>
                  }
                  return <li
                    key={ index }
                    onClick={ () => {
                      toggleActiveClass()
                    } }
                  >
                    { child }
                  </li>
                })
              : <li></li>
            }
          </ul>
        </Fragment>
        : <></>
      }
    </div>
  )
}

TinySlider.defaultProps = {
  showButtons: true,
  type: 'list',
  settings: {
    container: '.slider',
    mode: 'carousel',
    axis: 'horizontal',
    items: 1,
    gutter: 0,
    edgePadding: 0,
    fixedWidth: false,
    autoWidth: false,
    viewportMax: false,
    slideBy: 1,
    center: false,
    controls: false,
    controlsPosition: 'top',
    controlsText: ['prev', 'next'],
    controlsContainer: false,
    prevButton: false,
    nextButton: false,
    nav: true,
    navPosition: 'top',
    navContainer: false,
    navAsThumbnails: false,
    arrowKeys: false,
    speed: 300,
    autoplay: false,
    autoplayPosition: 'top',
    autoplayTimeout: 5000,
    autoplayDirection: 'forward',
    autoplayText: ['start', 'stop'],
    autoplayHoverPause: false,
    autoplayButton: false,
    autoplayButtonOutput: true,
    autoplayResetOnVisibility: true,
    animateIn: 'tns-fadeIn',
    animateOut: 'tns-fadeOut',
    animateNormal: 'tns-normal',
    animateDelay: false,
    loop: true,
    rewind: false,
    autoHeight: false,
    responsive: {},
    lazyload: false,
    lazyloadSelector: '.tns-lazy-img',
    touch: true,
    mouseDrag: false,
    swipeAngle: 15,
    preventActionWhenRunning: false,
    preventScrollOnTouch: false,
    nested: false,
    freezable: true,
    disable: false,
    startIndex: 0,
    onInit: false,
    useLocalStorage: true,
    nonce: false
  }
}

export default TinySlider