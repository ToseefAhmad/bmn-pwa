import React from 'react'
import { arrayOf, bool, int, shape, string } from "prop-types"
import { useQuery } from '@apollo/client'

import { mergeClasses } from "@magento/venia-ui/lib/classify"
import defaultClasses from "./productLabel.less"

import GET_PRODUCT_LABEL_CONFIG from '../../queries/getProductLabelConfig.graphql'

import Image from './Type/image'
import Text from './Type/text'

const ProductLabel = props => {
  const {
    productLabels,
    inMediaGallery
  } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    data,
    loading,
    error
  } = useQuery(GET_PRODUCT_LABEL_CONFIG)

  if (loading || error || !data) {
    return <></>
  }

  const validate = () => {
    return productLabels && productLabels.length > 0 &&
      data.storeConfig.product_labels_general_enabled === '1' &&
      !(inMediaGallery && data.storeConfig.product_labels_general_view_on_image_gallery === '0')
  }

  const productLabelsMap = validate()
    ? productLabels.map((productLabel, key) => {
      if (parseInt(productLabel.status) === 1) {
        return productLabel.label_type === 'text'
          ? <Text
            key={ key }
            productLabel={ productLabel }
          />
          : <Image
            key={ key }
            productLabel={ productLabel }
          />
      }

      return null
    }) : null

  return productLabelsMap ?
    <div className={ classes.productLabel__wrapper }>
      { productLabelsMap }
    </div> : <></>
}

ProductLabel.propTypes = {
  productLabels: arrayOf(
    shape({
      status: string,
      name: string,
      label_type: string,
      background_color: string,
      label_text: string,
      color: string,
      image: string,
      alt_text: string
    })
  ).isRequired,
  inMediaGallery: bool,
  data: shape({
    storeConfig: shape({
      id: int,
      product_labels_general_enabled: string,
      product_labels_general_view_on_image_gallery: string
    })
  }),
  classes: shape({
    productLabel__wrapper: string
  })
}

export default ProductLabel
