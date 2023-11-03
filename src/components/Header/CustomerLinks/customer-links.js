import React from 'react'
import { useQuery } from '@apollo/client'
import GET_CUSTOMER_LINKS from '../../../queries/getCustomerLinks.graphql'
import classNames from '../customerAccount.less'

const CustomerLinks = props => {
	const { data, loading, error } = useQuery(GET_CUSTOMER_LINKS)

	if (loading || error || !data) {
		return (<></>)
	}

	const customerLinks = data.storeConfig.theme_header_customer_links.map((customerLink, key) => {
		return <li
			className={ classNames.customerAccountMenu__item }
			key={ key }
		>
			<a
				key={ 'customerLink_' + key }
				href={ customerLink.url }
				className={ classNames.customerAccountMenu__link }
				title={ customerLink.title }
			>
				<span className={ classNames.customerAccountMenu__contentTitle }>{ customerLink.title }</span>
				<span className={ classNames.customerAccountMenu__contentSubtitle }>{ customerLink.subtitle }</span>
			</a>
		</li>
	})

	return customerLinks
}

export default CustomerLinks