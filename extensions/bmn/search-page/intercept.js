module.exports = (targets) => {
	const { Targetables } = require('@magento/pwa-buildpack')

	const targetables = Targetables.using(targets)
	targetables.setSpecialFeatures('esModules', 'cssModules')

	/**
	 * add Search route
	 */
	targets.of('@magento/venia-ui').routes.tap(routes => {
		routes.push({
			name: 'SearchPage',
			pattern: '/search',
			exact: true,
			path: '@bmn/search-page/src/components/CatalogSearch'
		})
	})
}
