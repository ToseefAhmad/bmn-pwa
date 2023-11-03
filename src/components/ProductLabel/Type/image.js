import React from 'react'
import { shape, string } from "prop-types";

import { mergeClasses } from "@magento/venia-ui/lib/classify";
import defaultClasses from "./image.less";

const Image = props => {
  const { productLabel } = props
  const classes = mergeClasses(defaultClasses, props.classes);
  let content  = <></>

  if ('image' in productLabel) {
    const imageData = JSON.parse(productLabel.image)[0]

    if ('url' in imageData) {
      const altText = productLabel.alt_text
        ? productLabel.alt_text
        : productLabel.name

      content = <div className={classes.productLabel__image}>
        <img
          src={ imageData.url }
          alt={ altText }
          title={ altText }
        />
      </div>
    }
  }

  return content
}

Image.propTypes = {
  productLabel: shape({
    status: string,
    name: string,
    label_type: string,
    background_color: string,
    label_text: string,
    color: string,
    image: string,
    alt_text: string
  }).isRequired,
  classes: shape({
    productLabel__image: string
  }),
}

export default Image
