import { gql } from 'graphql-tag'

export const LOGIN_CONFIG = gql`
	query getLoginConfig {
		storeConfig {
			id
			customer_pwa_login_cms_block_login
			customer_pwa_login_cms_block_create_account
			customer_pwa_login_cms_block_create_company
		}
	}
`

export default {
	getLoginConfig: LOGIN_CONFIG
}