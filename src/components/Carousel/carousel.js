import React, { useMemo, useRef, useState } from 'react'
import { string, number, node, shape, arrayOf, oneOf, bool, func, object, oneOfType } from 'prop-types'
import TinySlider from './tiny-slider'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './carousel.less'

const Carousel = props => {
  const reference = useRef(null)
  const {
    children,
    settings,
    showButtons,
    type,
    thumbs
  } = props
  const [randomId, setRandomId] = useState(false)

  useMemo(() => {
    if (!randomId) {
      setRandomId(Math.random().toString(36).substr(2, 9))
    }
  }, [randomId])

  const classes = mergeClasses(defaultClasses, props.classes)

  return <div className={ classes.wrapper }>
    <TinySlider
      settings={ settings }
      listRef={ reference }
      showButtons={ showButtons }
      type={ type }
      thumbs={ thumbs }
      randomId={ randomId }
    >
      <div
        ref={ reference }
        className={ defaultClasses.sliderWrapper }
        id={ 'slider-' + randomId }
      >
        { children }
      </div>
    </TinySlider>
  </div>
}

Carousel.defaultProps = {
  type: 'list'
}

Carousel.propTypes = {
  classes: shape({
    active: string,
    buttons__wrapper: string,
    button__next: string,
    button__prev: string,
    thumbs: string,
    wrapper: string,
  }),
  children: node,
  showButtons: bool,
  thumbs: bool,
  type: oneOf(['image', 'list']),
  // see https://github.com/ganlanyuan/tiny-slider#options for what each options means.
  settings: shape({
    container: oneOfType([node, string]),
    mode: oneOf(['carousel', 'gallery']),
    axis: oneOf(['horizontal', 'vertical']),
    items: number,
    gutter: number,
    edgePadding: number,
    fixedWidth: oneOfType([number, bool]),
    autoWidth: bool,
    viewportMax: oneOfType([number, bool]),
    slideBy: oneOfType([number, string]),
    center: bool,
    controls: bool,
    controlsContainer: oneOfType([node, string, bool]),
    controlsPosition: oneOf(['top', 'bottom']),
    controlsText: arrayOf(string),
    prevButton: oneOfType([node, string, bool]),
    nextButton: oneOfType([node, string, bool]),
    nav: bool,
    navPosition: oneOf(['top', 'bottom']),
    navContainer: oneOfType([node, string, bool]),
    navAsThumbnails: bool,
    arrowKeys: bool,
    speed: number,
    autoplay: bool,
    autoplayPosition: oneOf(['top', 'bottom']),
    autoplayTimeout: number,
    autoplayDirection: oneOf(['forward', 'backward']),
    autoplayText: arrayOf(string),
    autoplayHoverPause: bool,
    autoplayButton: oneOfType([node, string, bool]),
    autoplayButtonOutput: bool,
    autoplayResetOnVisibility: bool,
    animateIn: string,
    animateOut: string,
    animateNormal: string,
    animateDelay: oneOfType([number, bool]),
    loop: bool,
    rewind: bool,
    autoHeight: bool,
    responsive: object,
    lazyload: bool,
    lazyloadSelector: string,
    touch: bool,
    mouseDrag: bool,
    swipeAngle: oneOfType([number, bool]),
    preventActionWhenRunning: bool,
    preventScrollOnTouch: oneOfType([oneOf(['auto', 'force']), bool]),
    nested: oneOfType([oneOf(['inner', 'outer']), bool]),
    freezable: bool,
    disable: bool,
    startIndex: number,
    onInit: oneOfType([func, bool]),
    useLocalStorage: bool,
    nonce: oneOfType([string, bool])
  })
}


export default Carousel
