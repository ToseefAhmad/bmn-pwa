import { gql } from 'graphql-tag'

export const GET_CMS_PAGE = gql`
	query getCmsPage(
	  $identifier: String
	) {
	  cmsPage(
	    identifier: $identifier
	  ) {
	    page_id
	    identifier
	    url_key
	    content
	    content_heading
	    title
	    page_layout
	    page_hierarchy {
	      id
	      url_key
	      url_path
	      title
	    }
	    meta_title
	    meta_keywords
	    meta_description
	  }
	}
`

export const GET_CMS_CONFIG = gql`
	query getCmsConfig {
	  storeConfig {
	    id
	    cms_no_route
	  }
	}
`

export default {
	getCmsPage: GET_CMS_PAGE,
	getCmsConfig: GET_CMS_CONFIG
}