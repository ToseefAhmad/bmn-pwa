import React from 'react'
import PropTypes from 'prop-types'
import t from '@bmn/translate'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './stock-notice.less'
import { useUserContext } from '@magento/peregrine/lib/context/user'

const StockNotice = props => {
  const { text, color, showIcon, bold, size } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const [{ isSignedIn }] = useUserContext()

  let inlineStyle = {
    color: color
  }

  if (bold) {
    inlineStyle = {
      ...inlineStyle,
      fontWeight: 'bold'
    }
  }

  if (size) {
    inlineStyle = {
      ...inlineStyle,
      fontSize: size
    }
  }

  return <div className={ classes.onlineStockWrapper }>
    {
      isSignedIn
        ? <div className={ showIcon ? classes.delivery__icon : classes.availability }>
        <span
          className={ classes.deliveryTitle }
          style={ inlineStyle }
        >
          {text}
        </span>
        </div>
        : <></>
    }
  </div>
}

StockNotice.propTypes = {
  classes: PropTypes.shape({
    onlineStockWrapper: PropTypes.string,
    availability: PropTypes.string,
    deliveryTitle: PropTypes.string,
    delivery__icon: PropTypes.string
  }),
  text: PropTypes.string,
  color: PropTypes.string,
  showIcon: PropTypes.bool,
  bold: PropTypes.bool,
  size: PropTypes.string
}

StockNotice.defaultProps = {
  text: t({ s: 'in stock' }),
  color: '#45a850',
  showIcon: false,
  bold: false
}

export default StockNotice
