import React, { Fragment, useState } from 'react'
import { Form } from 'informed'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import Button, { BUTTON_TYPE_SUBMIT } from '../Button'
import classes from './addToCart.less'

import { any, array, arrayOf, bool, number, oneOf, oneOfType, shape, string } from 'prop-types'
import LogInButton from '../Customer/logInButton'
import t from '@bmn/translate'
import RequisitionListMenu from '../RequisitionList/requisition-list-menu'
import { useProductFullDetail } from '../ProductFullDetail/useProductFullDetail'
import { useToasts } from '@magento/peregrine'
import AddToCartModal from '../Cart/AddToCartModal'
import { useCustomerSegments } from '../../talons/CustomerSegments/useCustomerSegments'
import {
  ADD_CONFIGURABLE_MUTATION,
  ADD_SIMPLE_MUTATION
} from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce'

const AddToCart = props => {
	const {
		buttonText,
		item,
		qtyWrapperChildren,
		type,
		requisitionPosition,
		sliderEnabled,
		addToCartModalButtons,
		disableButton,
		showModal
	} = props

	const {
		canAddToCart,
		segmentIsAvailable,
		getSaleableSegmentMessage
	} = useCustomerSegments({ product: item })
	const [{ isSignedIn }] = useUserContext()
	const [, { addToast }] = useToasts()
	const [addToCartModal, setAddToCartModal] = useState(null)
	const [isAdding, setIsAdding] = useState('')

	const talonProps = useProductFullDetail({
		addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
		addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
		product: item
	})

	const {
		handleAddToCart,
		handleSetQuantity,
		productDetails,
		quantity
	} = talonProps

	const addToCartHandler = async (productSku) => {
		setIsAdding(productSku)

		const addToCart = await handleAddToCart()

		if (showModal && addToCart.quantity && addToCart.addedProduct) {
			setAddToCartModal(
				<Fragment>
					<AddToCartModal
						data={ { product: addToCart.addedProduct } }
						qtyAdded={ addToCart.quantity }
						callback={ () => setAddToCartModal(null) }
						addToCartModalButtons={ addToCartModalButtons }
					/>
				</Fragment>
			)
		}

		if (addToCart.error && addToCart.productName && addToCart.desiredQty) {
			addToast({
				type: 'error',
				message: t({
					s: 'Could not add %1 pieces of %2 to the cart.',
					r: [addToCart.desiredQty, addToCart.productName]
				}),
				timeout: 5000
			})
		}

		setIsAdding('')
	}

	const text = buttonText
		? buttonText
		: t({ s: 'Add to cart' })

	const buttonClassName = type === 'detail'
		? classes.addToCart__detailIcon
		: classes.addToCart__icon

	const inputHandler = e => {
		if (e.key.toLowerCase() === 'e' || e.key === '+' || e.key === '-') {
			e.preventDefault()
		}
	}

	/**
	 * Check if add to cart must be prevented by customer segment.
	 * @returns {boolean}
	 */
	const canAddToCartByCustomerSegment = () => {
		return canAddToCart()
	}

	return (
		<div className={ classes.addToCart__container }>
			<Form className={ sliderEnabled ? classes.addToCart__formWrapper : null }>
				{
					isSignedIn && type === 'detail' || type === 'list'
						? <div className={ classes.addToCart__qtyWrapper }>
							{ type === 'list' ? qtyWrapperChildren : <></> }
							{
								isSignedIn && !sliderEnabled && canAddToCartByCustomerSegment()
									? <input
										id={ 'qty_input_%1'.replace('%1', item.id) }
										value={ quantity }
										type={ 'number' }
										min={ 1 }
										onKeyDown={ inputHandler }
										onChange={ e => handleSetQuantity(e.target.value) }
										className={ classes.addToCart__qtyInput }
									/>
									: null
							}
							{ type === 'detail' && canAddToCartByCustomerSegment() ? qtyWrapperChildren : <></> }
						</div>
						: null
				}
				<div className={ classes.addToCart__actionWrapper }>
					{
						isSignedIn
							? <Fragment>
								{ segmentIsAvailable() ?
									<Fragment>
										{ canAddToCartByCustomerSegment() ?
											<Fragment>
												{ sliderEnabled
													? <input
														id={ 'qty_input_%1'.replace('%1', item.id) }
														value={ quantity }
														type={ 'number' }
														min={ 1 }
														onKeyDown={ inputHandler }
														onChange={ e => handleSetQuantity(e.target.value) }
														className={ classes.addToCart__qtyInput }
													/>
													: <Fragment/>
												}
												{ requisitionPosition === 'icon-left'
													? <RequisitionListMenu
														products={ [item] }
														type={ requisitionPosition }
														inlineCss={
															sliderEnabled
																? { marginRight: 0, width: '40px', height: '40px' }
																: {}
														}
													/>
													: <></>
												}

												<Button
													type={ BUTTON_TYPE_SUBMIT }
													cssClass={ 'primary' }
													busy={ isAdding === productDetails.sku }
													disabled={ disableButton }
													onClick={ () => addToCartHandler(productDetails.sku) }
												>
													{ type === 'detail' ?
														<Fragment>
                              <span className={ classes.detailButtonWrapper }>
                                <span className={ classes.plusSign }>
                                </span>
                                <span className={ buttonClassName }>
                                </span>
                                <span className={ classes.addToCart__text }>{ text }</span>
                              </span>
														</Fragment>
														: <Fragment>
															{
																sliderEnabled
																	? <Fragment>
                                <span className={ classes.plusSign }>
                                </span>
																		<span className={ buttonClassName }>
                                </span>
																	</Fragment>
																	: <Fragment>
																		<span className={ buttonClassName }> { text } </span>
																	</Fragment>
															}
														</Fragment>
													}
												</Button>
												{ requisitionPosition === 'icon-right'
													? <RequisitionListMenu
														products={ [item] }
														type={ requisitionPosition }
														classes={ { requisitionListingAdditional: props.classes.requisitionListingAdditional } }
													/>
													: <></>
												}
											</Fragment>
											: <span className={ (type === 'detail')
												? classes.saleableSegmentTextDetail
												: classes.saleableSegmentText }
											>
                        {
	                        getSaleableSegmentMessage()
                        }
                      </span>
										}
									</Fragment>
									: <></>
								}
							</Fragment>
							: <LogInButton/>
					}
				</div>
			</Form>
			{ addToCartModal }
		</div>
	)
}

AddToCart.propTypes = {
	buttonText: string,
	classes: shape({
		addToCart__actionWrapper: string,
		addToCart__container: string,
		addToCart__containerSlider: string,
		addToCart__detailIcon: string,
		addToCart__icon: string,
		addToCart__qtyInput: string,
		addToCart__qtyWrapper: string,
		addToCart__text: string,
		detailButtonWrapper: string,
		plusSign: string,
		requisitionListingAdditional: string
	}),
	item: shape({
		__typename: string,
		id: number,
		sku: string.isRequired,
		price_range: shape({
			maximum_price: shape({
				regular_price: shape({
					currency: string,
					value: number
				})
			})
		}),
		saleable_segment: shape({
			segment_ids: array,
			message: string
		}),
		media_gallery_entries: arrayOf(
			shape({
				label: string,
				position: number,
				disabled: bool,
				file: string.isRequired
			})
		),
		description: oneOfType([
			shape({
				html: string
			}),
			string
		])
	}).isRequired,
	qtyWrapperChildren: any,
	type: oneOf(['list', 'detail']),
	requisitionPosition: oneOf(['icon-left', 'icon-right']),
	addToCartModalButtons: array,
	disableButton: bool,
	showModal: bool
}

AddToCart.defaultProps = {
	type: 'list',
	requisitionPosition: 'icon-left',
	addToCartModalButtons: [],
	showModal: true
}

export default AddToCart
