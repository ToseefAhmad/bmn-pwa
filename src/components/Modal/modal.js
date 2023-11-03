import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { any, node, object } from 'prop-types'

const Modal = ({ component: Component, container, ...props }) => {
	const [innerContent, setInnerContent] = useState(false)
	const target = useMemo(
		() =>
			container instanceof HTMLElement
				? container
				: document.getElementById('root'),
		[container]
	)

	useEffect(() => {
		if (!innerContent) {
			container.innerHTML = ''
			setInnerContent(true)
		}
	}, [container, innerContent])

	if (!innerContent) return null

	return createPortal(<Component { ...props }/>, target)
}

export default Modal

Modal.propTypes = {
	component: any,
	children: node,
	container: object
}
