import React from 'react'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './add-to-cart-modal.less'
import modalClasses from '../Modal/modal.less'
import ThemeModal from '../Modal/ThemeModal'
import t from '@bmn/translate'
import { BUTTON_TYPE_ACTION, BUTTON_TYPE_NO_ACTION } from '../Button'
import { array, func, number, shape, string } from 'prop-types'
import { Portal } from '@magento/venia-ui/lib/components/Portal'

const IMAGE_WIDTH = 150

const AddToCartModal = props => {
	const {
		data,
		qtyAdded,
		callback,
		addToCartModalButtons
	} = props
	const classes = mergeClasses(defaultClasses, props.classes)
	const product = data.product

	const modalClass = modalClasses.modal__containerXl

	const actions = addToCartModalButtons.length > 0
		? addToCartModalButtons
		: [
			{
				type: BUTTON_TYPE_NO_ACTION,
				cssClass: 'tertiary-modal',
				text: t({ s: 'Continue shopping' }),
			},
			{
				type: BUTTON_TYPE_ACTION,
				cssClass: 'primary-modal',
				text: t({ s: 'Finish order' }),
				url: '/cart',
			}
		]

	return (
		<Portal>
			<ThemeModal
				title={ t({ s: 'You have added a product to your cart' }) }
				content={
					<div className={ classes.itemRow }>
						<div className={ classes.itemImage }>
							<img
								src={ product.small_image }
								alt={ product.name }
								width={ IMAGE_WIDTH }
							/>
						</div>
						<div className={ classes.itemInfo }>
              <span className={ classes.itemName }>
                <strong>{ t({ s: 'Product:' }) }</strong>
                <span>{ product.name }</span>
              </span>
							<span className={ classes.itemQty }>
                <strong>{ t({ s: 'Amount:' }) }</strong>
                <span>{ qtyAdded }</span>
              </span>
						</div>
					</div>
				}
				actions={ actions }
				callback={ callback }
				extraClass={ modalClass }
			/>
		</Portal>
	)
}

AddToCartModal.propTypes = {
	qtyAdded: number.isRequired,
	callback: func.isRequired,
	classes: shape({
		itemRow: string,
		itemImage: string,
		itemInfo: string,
		itemQty: string,
		itemName: string
	}),
	addToCartModalButtons: array
}

AddToCartModal.defaultProps = {
	addToCartModalButtons: []
}

export default AddToCartModal
