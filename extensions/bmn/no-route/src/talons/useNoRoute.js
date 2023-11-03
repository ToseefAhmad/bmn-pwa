import React from 'react'
import { shape, string } from 'prop-types'
import { useQuery } from '@apollo/client'
import DEFAULT_OPERATIONS from './no-route.gql'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge'

export const useNoRoute = (props = {}) => {
	const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations)
	const { getCmsConfig } = operations

	const { data: noRouteConfig } = useQuery(
		getCmsConfig,
		{
			fetchPolicy: 'cache-and-network'
		})

	return {
		noRouteIdentifier: ((noRouteConfig || {}).storeConfig || {}).cms_no_route
	}
}

useNoRoute.propTypes = {
	noRouteConfig: shape({
		storeConfig: shape({
			cms_no_route: string
		})
	})
}

