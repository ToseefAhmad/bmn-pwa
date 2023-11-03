import React from 'react'
import defaultClasses from './exceptional-header.less'
import { mergeClasses } from '@magento/venia-ui/lib/classify'

const toHTML = string => ({ __html: string });

const ExceptionalHeader = props => {
  const {
    content,
    desktopImage
  } = props
  const classes = mergeClasses(defaultClasses, props.classes);
  const imageStyle = {
    backgroundImage: 'url(' + desktopImage + ')',
  };
  return (
    <div className={ classes.ecpHeader }>
      <div className={ classes.ecpHeader__body }>
        <div className={ classes.ecpHeader__picture } style={ imageStyle }>
        </div>
        <div className={ classes.ecpHeader__content } dangerouslySetInnerHTML={ toHTML(content) }>
        </div>
      </div>
    </div>
  );
};

export default ExceptionalHeader;
