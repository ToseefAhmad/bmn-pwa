import React from 'react'
import { shape, string } from "prop-types";

import { mergeClasses } from "@magento/venia-ui/lib/classify";
import defaultClasses from "./text.less";

const Text = props => {
  const { productLabel } = props
  const classes = mergeClasses(defaultClasses, props.classes);
  let content = <></>

  if (productLabel.label_text) {
    const style = {}

    productLabel.background_color ? style.backgroundColor = '#' + productLabel.background_color : undefined
    productLabel.color ? style.color = '#' + productLabel.color : undefined

    content = <div
      className={ classes.productLabel__text }
      style={ style }
    >
      <span>{ productLabel.label_text }</span>
    </div>
  }

  return content
}

Text.propTypes = {
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
    productLabel__text: string
  }),
}

export default Text
