module.exports = (targets) => {
	const { Targetables } = require('@magento/pwa-buildpack')

	const targetables = Targetables.using(targets)
	targetables.setSpecialFeatures('esModules', 'cssModules')

	/**
	 * add Storelocator route
	 */
	targets.of('@magento/venia-ui').routes.tap(routes => {
		routes.push({
			name: 'StoreLocatorPage',
			pattern: '/vestigingen',
			exact: true,
			path: '@bmn/store-locator/src/components/StoreLocatorPage'
		})
	})

	/**
	 * add StorelocatorDetail route
	 */
	targets.of('@magento/venia-ui').routes.tap(routes => {
		routes.push({
			name: 'StoreLocatorPage',
			pattern: '/vestigingen/:slug',
			exact: true,
			path: '@bmn/store-locator/src/components/StoreLocatorPage/storeLocatorDetailPage'
		})
	})
}
