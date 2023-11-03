import React from 'react'
import PropTypes from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import logo from './logo.png'

const Logo = props => {
  const { height } = props
  const classes = mergeClasses({}, props.classes)

  return (
    <img
      className={ classes.logo }
      src={ logo }
      height={ height }
      alt="Bmn Bouwmaterialen"
      title="Bmn Bouwmaterialen"
    />
  )
}

Logo.propTypes = {
  classes: PropTypes.shape({
    logo: PropTypes.string,
  }),
  logoType: PropTypes.number,
  height: PropTypes.number,
}

Logo.defaultProps = {
  logoType: 1,
  height: 46,
}

export default Logo
