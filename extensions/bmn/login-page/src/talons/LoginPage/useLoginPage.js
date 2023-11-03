import { useQuery } from '@apollo/client'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge'
import DEFAULT_OPERATIONS from './login-page.gql'

export const useLoginPage = props => {
	const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations)
	const { getLoginConfig } = operations

	const { data } = useQuery(getLoginConfig)
	const { storeConfig } = data || {}


	return {
		data: storeConfig
	}
}

export default useLoginPage