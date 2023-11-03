module.exports = (targets) => {
	const { Targetables } = require('@magento/pwa-buildpack')
	const targetables = Targetables.using(targets)
	targetables.setSpecialFeatures('esModules', 'cssModules')

	/**
	 * Overwrite return for errorView
	 */
	const ErrorViewComponent = targetables.reactComponent(
		'@magento/venia-ui/lib/components/ErrorView/errorView.js'
	)

	ErrorViewComponent.addImport(
		"{ default as NoRoute } from '@bmn/no-route/src/components/NoRoute'"
	)

	ErrorViewComponent.replaceJSX(
		'<div className={classes.root} style={style}>',
		'<NoRoute { ...props } />'
	)

	/**
	 * Return fallback instead of a category list
	 */
	const CmsRootComponent = targetables.reactComponent(
		'@magento/venia-ui/lib/RootComponents/CMS/cms.js'
	)

	CmsRootComponent.addImport(
		"{ default as NoRouteFallback } from '@bmn/no-route/src/components/NoRoute'"
	)

	CmsRootComponent.replaceJSX(
		'<CategoryList>',
		'<NoRouteFallback { ...props }>'
	)
}