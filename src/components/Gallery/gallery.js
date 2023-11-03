import React, { Fragment, useMemo } from 'react'
import { any, array, bool, object, shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import GalleryItem from './item'
import defaultClasses from './gallery.less'

import Carousel from '../Carousel'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { useRealTimePricing } from '../../talons/RealTimePricing/useRealTimePricing'
import { useAppContext } from '@magento/peregrine/lib/context/app'

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
  const { small_image } = item
  return {
    ...item,
    small_image:
      typeof small_image === 'object' ? small_image.url : small_image
  }
}

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const { prices, getRealTimePrice } = useRealTimePricing({
    realTimePricing: props.crhData ? props.crhData : {}
  })
  const [{ isSignedIn }] = useUserContext()
  const {
    items,
    slider,
    hasBorder,
    addToCartModalButtons,
    showModal
  } = props
  const { enabled, responsive } = slider

  const settings = {
    lazyload: true,
    nav: false,
    controls: false,
    mouseDrag: true,
    loop: false,
    gutter: 25,
    responsive
  }

  const [{ isPageLoading }] = useAppContext()
  const galleryItems = useMemo(
    () => {
      return items.map((item, index) => {
        if (item === null) {
          return <GalleryItem key={ index }/>
        }
        const mappedItem = mapGalleryItem({ ...item, getRealTimePrice })

        return <GalleryItem
          key={ index }
          item={ mappedItem }
          sliderEnabled={ enabled }
          hasBorder={ hasBorder }
          disableButton={ isPageLoading }
          addToCartModalButtons = { addToCartModalButtons }
          showModal={ showModal }
        />
      })
    },
    [getRealTimePrice, items, isSignedIn, prices, isPageLoading, showModal])

  return (
    <Fragment>
      { enabled && galleryItems.length
        ?
        <Carousel settings={ settings }>
          { galleryItems }
        </Carousel>
        :
        <Fragment>
          <div className={ classes.items }>
            { galleryItems }
          </div>
        </Fragment>
      }
    </Fragment>
  )
}

Gallery.propTypes = {
  classes: shape({
    filters: string,
    items: string,
    pagination: string,
    root: string
  }),
  hasBorder: bool,
  items: array.isRequired,
  slider: shape({
    enabled: bool,
    responsive: object
  }),
  addToCartModalButtons: array,
  showModal: bool
}

Gallery.defaultProps = {
  slider: {
    enabled: false,
    responsive: {}
  },
  crhData: any,
  hasBorder: false,
  addToCartModalButtons: [],
  showModal: true
}

export default Gallery
