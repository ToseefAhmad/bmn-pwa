import React, { Fragment, useCallback, useEffect } from 'react'
import { arrayOf, bool, func, object, shape, string } from 'prop-types'

import classNames from './modal.less'
import Button from '../Button'

import Mask from '@magento/venia-ui/lib/components/Mask/mask'

import * as windowHelper from '../../utils/windowHelper'

const ThemeModal = props => {
	const {
		title,
		content,
		bottomContent,
		actions,
		callback,
		extraClass,
		hideFooter
	} = props

	const noScrollHandler = useCallback(() => {
		if (!windowHelper.hasLock()) {
			windowHelper.setLock()
		} else {
			windowHelper.removeLock()
		}
	}, [])

	useEffect(() => {
		noScrollHandler()

		return () => {
			noScrollHandler()
		}
	}, [title, noScrollHandler])

	const containerClass = extraClass
		? classNames.modal__container + ' ' + extraClass
		: classNames.modal__container

	const closeModal = () => {
		callback()
	}

	const ContentComponent = () => {
		return (
			<div className={ containerClass }>
				<div className={ classNames.modal__wrapper }>
					<div className={ classNames.modal__header }>
						<div>{ title }</div>
						<div
							className={ classNames.modal__close }
							onClick={ closeModal }
						/>
					</div>
					<div className={ classNames.modal__content }>
						<div className={ classNames.modal__contentTop }>
							{ content }
						</div>
						{
							bottomContent
								? <div className={ classNames.modal__contentBottom }>
									{ bottomContent }
								</div>
								: ''
						}
					</div>
					{ !hideFooter
						? <div className={ classNames.modal__footer }>
							{
								actions
									? actions.map((action, idx) =>
										<Button
											key={ idx }
											type={ action.type }
											cssClass={ action.cssClass }
											text={ action.text }
											url={ action.url }
											external={ action.external }
											onClick={ closeModal }
										/>
									)
									: ''
							}
						</div>
						: ''
					}
				</div>
				<Mask
					isActive={ true }
					dismiss={ closeModal }
				/>
			</div>
		)
	}

	return (
		<Fragment>
			<ContentComponent/>
		</Fragment>
	)
}

ThemeModal.propTypes = {
	title: string.isRequired,
	content: object.isRequired,
	bottomContent: object,
	actions: arrayOf(
		shape({
			type: string.isRequired,
			cssClass: string,
			text: string.isRequired,
			url: string,
			external: bool
		})
	),
	callback: func.isRequired,
	extraClass: string,
	hideFooter: bool
}


export default ThemeModal
