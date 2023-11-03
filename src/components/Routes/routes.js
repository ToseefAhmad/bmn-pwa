/**
 * @deprecated: We use the interceptors for this logic now.
 * For login page: @bmn/login-page
 * For search page: @bmn/search-page
 */

import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator'
import MagentoRoute from '../MagentoRoute/magentoRoute'
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange'
import StoreLocatorDetailPage from '../StoreLocatorPage/storeLocatorDetailPage'
import StoreLocatorPage from '../StoreLocatorPage'
import { useQuery } from '@apollo/client'
import { useUserContext } from '@magento/peregrine/lib/context/user'

import GET_STORE_LOCATOR_CONFIG from '../../queries/getStoreLocatorConfig.graphql'
import GET_STORE_LOCATOR_STORE_LIST from '../../queries/getStoreLocatorStoreList.graphql'

const CartPage = lazy(() => import('../CartPage'))
const CheckoutPage = lazy(() => import('@magento/venia-ui/lib/components/CheckoutPage'))
const CreateAccountPage = lazy(() => import('@magento/venia-ui/lib/components/CreateAccountPage'))

export const EXACT_URL_CREATE_ACCOUNT = '/create-account'
export const EXACT_URL_CART = '/cart'
export const EXACT_URL_CHECKOUT = '/checkout'
export const EXACT_URL_LOGIN = '/login'

const Routes = () => {
	const [{ isSignedIn }] = useUserContext()

	let storeLocatorRoute = <></>
	let storeLocatorDetailRoutes = <></>

	const { data: storeLocatorConfigData } = useQuery(GET_STORE_LOCATOR_CONFIG)
	const { data: storeLocatorStoreListData } = useQuery(GET_STORE_LOCATOR_STORE_LIST)

	const isStoreLocatorDataAvailable = () => {
		return storeLocatorConfigData
			&& storeLocatorConfigData.storeConfig
			&& storeLocatorStoreListData
			&& storeLocatorStoreListData.storeLocatorStoreList
	}

	const trimRoute = (route) => {
		while (route.charAt(0) === '/') {
			route = route.substr(1)
		}

		return route
	}

	if (isStoreLocatorDataAvailable()) {
		const storeLocatorConfig = storeLocatorConfigData.storeConfig
		const storeLocatorStoreList = storeLocatorStoreListData.storeLocatorStoreList.stores

		storeLocatorRoute = <Route exact path={ '/' + trimRoute(storeLocatorConfig.store_locator_general_store_url) }>
			<StoreLocatorPage
				storeLocatorConfig={ storeLocatorConfig }
				storeLocatorStoreList={ storeLocatorStoreListData.storeLocatorStoreList.stores }
			/>
		</Route>

		storeLocatorDetailRoutes = storeLocatorStoreList.map((storeLocatorStore) => {
			const route = '/' + trimRoute(storeLocatorConfig.store_locator_general_store_url) + '/' + storeLocatorStore.url

			return <Route
				key={ 'store_locator_route_' + storeLocatorStore.id }
				exact path={ route }
			>
				<StoreLocatorDetailPage
					storeLocatorConfig={ storeLocatorConfig }
					storeLocatorStore={ storeLocatorStore }
				/>
			</Route>
		})
	}

	const { pathname } = useLocation()
	useScrollTopOnChange(pathname)

	return (
		<Suspense fallback={ fullPageLoadingIndicator }>
			<Switch>
				{ storeLocatorRoute }
				{ storeLocatorDetailRoutes }
				<Route exact path={ EXACT_URL_CREATE_ACCOUNT }>
					<CreateAccountPage/>
				</Route>
				<Route exact path={ EXACT_URL_CART }>
					<CartPage/>
				</Route>
				<Route exact path={ EXACT_URL_CHECKOUT }>
					<CheckoutPage/>
				</Route>
				<Route>
					<MagentoRoute/>
				</Route>
			</Switch>
		</Suspense>
	)
}

export default Routes
