import React from 'react'

import DEFAULT_OPERATIONS from './store-locator.gql'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge'
import { useQuery } from '@apollo/client'

const useStoreLocator = (props = {}) => {
	const { slug } = props
	const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations)
	const {
		getStoreLocatorConfig,
		getStoreLocatorStoreList
	} = operations

	const {
		data: storeLocatorConfigData,
		loading: storeLocatorConfigLoading,
		error: storeLocatorConfigError
	} = useQuery(getStoreLocatorConfig)

	const {
		data: storeLocatorStoreListData,
		loading: storeLocatorStoreListLoading,
		error: storeLocatorStoreListError
	} = useQuery(getStoreLocatorStoreList)

	const storeLocatorConfig = (!storeLocatorConfigLoading || !storeLocatorConfigError)
		? storeLocatorConfigData
		: {}

	const { storeConfig } = storeLocatorConfig || {}

	const storeLocatorStoreListResult = (!storeLocatorStoreListLoading || !storeLocatorStoreListError)
		? storeLocatorStoreListData
		: {}

	const { storeLocatorStoreList } = storeLocatorStoreListResult || {}
	const { stores } = storeLocatorStoreList || {}

    const storeLocatorStore = storeLocatorStoreListData !== undefined ? stores.filter(store => store.url === slug).shift() : {}

	return {
		storeLocatorConfig: storeConfig,
        storeLocatorStoreList: storeLocatorStoreListData !== undefined ? stores : [],
		storeLocatorStore
	}
}

export default useStoreLocator
