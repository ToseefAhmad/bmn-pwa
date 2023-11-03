import React from 'react'
import Gallery from '../Gallery'
import { array, bool, number, object, shape } from 'prop-types'

export const LINKED_PRODUCT_RELATED = 'related'
export const LINKED_PRODUCT_UPSELL = 'upsell'
export const LINKED_PRODUCT_CROSSSELL = 'crosssell'

export const DEFAULT_SLIDER_CONFIG = {
  enabled: true,
  responsive: {
    1: { items: 1, },
    480: { items: 2 },
    786: { items: 3 },
    1024: { items: 4 },
    1200: { items: 5 }
  }
}

const LinkedProduct = props => {
  const {
    crhData,
    items,
    sliderConfig,
    addToCartModalButtons,
    showModal
  } = props

  return <Gallery
    crhData={ crhData }
    items={ items }
    slider={ sliderConfig ? sliderConfig : DEFAULT_SLIDER_CONFIG }
    addToCartModalButtons={ addToCartModalButtons }
    showModal={ showModal }
  />
}

LinkedProduct.propTypes = {
  crhData: object,
  items: array.isRequired,
  sliderConfig: shape({
    enabled: bool.isRequired,
    responsive: shape({
      1: shape({ items: number }),
      768: shape({ items: number }),
      1024: shape({ items: number })
    })
  }),
  addToCartModalButtons: array,
  showModal: bool
}

LinkedProduct.defaultProps = {
  sliderConfig: null,
  addToCartModalButtons: [],
  showModal: true
}

export default LinkedProduct
