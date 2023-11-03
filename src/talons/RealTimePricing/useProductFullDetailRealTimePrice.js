import React, { useCallback, useMemo, useState } from 'react'
import { request } from '@magento/peregrine/lib/RestApi/Magento2'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import t from '@bmn/translate'
import globalStyles from '../../web/globals.less'

export const PRICE_TYPE_BASE = 'base'
export const PRICE_TYPE_COMPLEX = 'complex'
export const PRICE_TYPE_DIRECT = 'direct'
export const PRICE_TYPE_TIER = 'tier'

const initialPricingState = {
	base: [],
	complex: [],
	direct: [],
	tier: []
}

export const useProductFullDetailRealTimePrice = props => {
	const {
		realTimePricing,
		hideLoading
	} = props

	const [prices, setPrices] = useState(initialPricingState)
	const [{ isSignedIn }] = useUserContext()

	useMemo(() => {
		const mapBaseAndComplex = requestData => {
			if (requestData && requestData.hasOwnProperty('skuData') && Object.entries(requestData.skuData).length > 0) {
				const skuData = {}
				for (const itemKey in requestData.skuData) {
					const item = requestData.skuData[itemKey]
					skuData[item.sku] = {
						product_id: item.product_id,
						sku: item.sku,
						aofak: item.aofak,
						qty: item.qty
					}
				}

				return {
					actionName: requestData.actionName,
					extra_pwa_html: true,
					multiSku: true,
					aofak: '',
					worksiteId: 0,
					skuData
				}
			}
		}

		const mapData = async type => {
			if (realTimePricing) {
				const requestData = realTimePricing[type]
				if (type === 'base' || type === 'complex') {
					return mapBaseAndComplex(requestData)
				}

				return requestData
			}
		}

		const fetchPrices = async () => {
			if (isSignedIn) {
				const newPrices = initialPricingState
				for (const priceType of Object.keys(initialPricingState)) {
					const requestData = await mapData(priceType)
					if (requestData) {
						try {
							const response = await request('/rest/V1/price/' + priceType,
								{
									method: 'POST',
									headers: {
										'Content-type': 'application/json'
									},
									body: JSON.stringify(requestData)
								})
							newPrices[priceType] = response[0]
						} catch (e) {
							// Set newPrices to initialPricingState to prevent errors when rest api call fails.
							newPrices[priceType] = initialPricingState
						}
					}
				}
				setPrices({
					...prices,
					base: newPrices.base,
					complex: newPrices.complex,
					direct: newPrices.direct,
					tier: newPrices.tier
				})
			}
		}
		fetchPrices()
	}, [isSignedIn, realTimePricing])

	const getRealTimePrice = useCallback((sku, type, hideLoader = false) => {
		const priceData = {
			price: hideLoading || hideLoader ? null : <span className={ globalStyles.loading }>{ t({ s: 'Loading' }) }</span>,
			rawPrice: '',
			extra: ''
		}
		if (prices && prices[type]) {
			const realTime = prices[type][sku]
			if (realTime && realTime.hasOwnProperty('raw_price')) {
				priceData.rawPrice = realTime.raw_price
			}
			if (realTime && realTime.hasOwnProperty('OBVPR')) {
				priceData.price = realTime.OBVPR
				if (realTime.hasOwnProperty('extra_html') && realTime.extra_html) {
					const extraHtml = realTime.extra_html.replace('per', '').trim()
					priceData.extra = 'per ' + t({ s: extraHtml.toUpperCase() })
				}
				if (realTime.hasOwnProperty('extra_pwa_html') && realTime.extra_pwa_html) {
					const extraHtml = realTime.extra_pwa_html.replace('per', '').trim()
					priceData.extra = 'per ' + t({ s: extraHtml.toUpperCase() })
				}
			} else {
				priceData.price = ''
			}
		}

		return priceData
	}, [hideLoading, prices])

	return {
		prices,
		getRealTimePrice
	}
}
