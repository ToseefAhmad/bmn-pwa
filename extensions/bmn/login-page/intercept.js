module.exports = (targets) => {
	const { Targetables } = require('@magento/pwa-buildpack')

	const targetables = Targetables.using(targets)
	targetables.setSpecialFeatures('esModules', 'cssModules')

	/**
	 * add login route
	 */
	targets.of('@magento/venia-ui').routes.tap(routes => {
		routes.push({
			name: 'LoginPage',
			pattern: '/login',
			exact: true,
			path: '@bmn/login-page/src/components/LoginPage'
		})
	})
}
