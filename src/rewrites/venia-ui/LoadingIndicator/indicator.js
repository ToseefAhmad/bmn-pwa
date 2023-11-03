import React from 'react'

import defaultClasses from './indicator.less'
import Icon from '@magento/venia-ui/lib/components/Icon'
import LoadingIcon from '../../../web/icons/bmn-logo-block.svg'
import { useStyle } from '@magento/venia-ui/lib/classify'

const LoadingIndicator = props => {
	const classes = useStyle(defaultClasses, props.classes)
	const className = props.global ? classes.global : classes.root

	return (
		<div
			className={ className }
			data-indicator={ true }
		>
			<img
        src={ LoadingIcon }
        alt={ 'loading' }
      />
			<span className={ classes.message }>
        { props.children }
      </span>
		</div>
	)
}

export default LoadingIndicator
