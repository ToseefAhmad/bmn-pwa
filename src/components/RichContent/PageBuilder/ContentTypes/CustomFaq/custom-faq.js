import React, { useEffect } from 'react'
import defaultClasses from './custom-faq.less'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { shape, string } from "prop-types";

import { scrollByHash } from '../../../../Anchor/scroll'

const toHTML = string => ({ __html: string });

const CustomFaq = props => {
  const { content } = props
  const classes = mergeClasses(defaultClasses, props.classes)

  useEffect(() => {
    scrollByHash()
  }, [])

  return (
    <div
      className={ classes.faqQuestion__wrapper }
      dangerouslySetInnerHTML={ toHTML(content) }
    >
    </div>
  );
};

CustomFaq.propTypes = {
  classes: shape({
    faqQuestion__wrapper: string
  })
}

export default CustomFaq;
