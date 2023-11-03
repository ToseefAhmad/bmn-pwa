import React, { Fragment } from 'react'
import { useNoRoute } from '../../talons/useNoRoute'
import CMSPage from '@magento/venia-ui/lib/RootComponents/CMS'
import { HeadProvider, Meta } from '@magento/venia-ui/lib/components/Head'

const NoRoute = () => {
	const { noRouteIdentifier } = useNoRoute()

	if (!noRouteIdentifier) {
		return <Fragment/>
	}

	return <Fragment>
		<HeadProvider>
			<Meta
				name="prerender-status-code"
				content={ 404 }
			/>
		</HeadProvider>
		<CMSPage identifier={ noRouteIdentifier }/>
	</Fragment>
}

export default NoRoute