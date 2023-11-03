import { gql } from 'graphql-tag'

export const GET_STORE_LOCATOR_CONFIG = gql`
	query getStoreLocatorData {
	  storeConfig {
	    id
	    store_locator_general_api_key
	    store_locator_general_store_url
	    store_locator_general_language
	    store_locator_general_use_info_window
	    store_locator_general_lat
	    store_locator_general_lng
	    store_locator_general_marker_class
	    store_locator_general_active_marker_class
	    store_locator_general_location_class
	    store_locator_advanced_units
	    store_locator_advanced_map_type_control
	    store_locator_advanced_scroll_wheel_zoom
	    store_locator_advanced_street_view_control
	    store_locator_advanced_zoom
	    store_locator_advanced_location_zoom
	    store_locator_advanced_mobile_zoom
	    store_locator_advanced_mobile_location_zoom
	    store_locator_advanced_nearest_locations
	    store_locator_advanced_cluster_grid_size
	    store_locator_advanced_max_cluster_zoom
	    store_locator_advanced_custom_map_styles
	    store_locator_advanced_groups {
	      label
	    }
	    store_locator_pwa_cms_block
	  }
	}
`

export const GET_STORE_LOCATOR_STORE_LIST = gql`
	query getStoreLocatorStoreList($ids: [String]) {
		storeLocatorStoreList(ids: $ids) {
			stores {
	      id
	      name
	      location
	      street
	      zip
	      city
	      phone
	      url
	      latitude
	      longitude
	      marker_class
	    }
		}
	}
`

export default {
	getStoreLocatorConfig: GET_STORE_LOCATOR_CONFIG,
	getStoreLocatorStoreList: GET_STORE_LOCATOR_STORE_LIST
}