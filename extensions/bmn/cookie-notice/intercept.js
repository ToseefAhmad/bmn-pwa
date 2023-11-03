module.exports = (targets) => {
	const { Targetables } = require('@magento/pwa-buildpack')

	const targetables = Targetables.using(targets)
	targetables.setSpecialFeatures('esModules', 'cssModules')

	const AppComponent = targetables.reactComponent(
		'../../src/components/App/app.js'
	)

	const CookieNotice = AppComponent.addImport(
		"{default as CookieNotice} from '@bmn/cookie-notice/src/components/CookieNotice'"
	)

	AppComponent.insertAfterJSX(
		'<Main isMasked={hasOverlay}>',
		`<${CookieNotice}/>`
	)
}
