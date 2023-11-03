import { gql } from 'graphql-tag'

export const GET_COOKIE_NOTICE_CONFIG = gql`
	query getCookieConfig {
	  storeConfig {
	    id
	    web_cookie_cookie_lifetime
	    web_cookie_cookie_path
	    web_cookie_cookie_domain
	    web_cookie_cookie_restriction
	    web_cookie_page_link_text
	    web_cookie_page_id
	    web_cookie_notice_text
	    web_cookie_button_text
	  }
	}
`

export default {
	getCookieNoticeConfigQuery: GET_COOKIE_NOTICE_CONFIG
}