import { useQuery } from '@apollo/client'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge'
import DEFAULT_OPERATIONS from './cookie-notice.gql'
import { setCookie } from '../../util/cookie-manager'
import { useState } from 'react'
import { getCookie } from '../../../../../../src/components/Cookie/cookieManager'

export const COOKIE_NAME = 'user_agreed_with_cookies'

export const flatten = data => {
	const { storeConfig } = data || {}
	const {
		web_cookie_cookie_lifetime,
		web_cookie_cookie_path,
		web_cookie_cookie_domain,
		web_cookie_cookie_restriction,
		web_cookie_page_link_text,
		web_cookie_page_id,
		web_cookie_notice_text,
		web_cookie_button_text
	} = storeConfig || {}
	return {
		lifetime: web_cookie_cookie_lifetime,
		path: web_cookie_cookie_path,
		domain: web_cookie_cookie_domain,
		restriction: web_cookie_cookie_restriction,
		linkText: web_cookie_page_link_text,
		pageId: web_cookie_page_id,
		text: web_cookie_notice_text,
		buttonText: web_cookie_button_text
	}
}

export const useCookieNotice = (props = {}) => {
	const [isActive, setIsActive] = useState(false)
	const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations)
	const { getCookieNoticeConfigQuery } = operations
	const { data } = useQuery(getCookieNoticeConfigQuery)
	const cookieData = flatten(data)

	const setAllowCookiesCookie = () => {
		setCookie(
			COOKIE_NAME,
			true,
			cookieData.lifetime !== null ? cookieData.lifetime : 3600,
			cookieData.path !== null ? cookieData.path : '/'
		)

		setIsActive(false)
	}

	const showNotice = () => {
		return cookieData.restriction === '1'
			&& !isActive
			&& !getCookie(COOKIE_NAME)
	}

	if (showNotice()) {
		setIsActive(true)
	}

	return {
		data: cookieData,
		setAllowCookiesCookie,
		isActive
	}
}