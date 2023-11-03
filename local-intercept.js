/* eslint-disable */
/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

const componentOverrideMapping = require('./componentOverrideMapping')
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin')

module.exports = targets => {
  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new moduleOverridePlugin(componentOverrideMapping).apply(compiler)
  })

  const buildpackTargets = targets.of('@magento/pwa-buildpack')

  buildpackTargets.envVarDefinitions.tap((defs) => {
    defs.sections.push({
      name: 'GTM Code',
      variables: [
        {
          name: 'GTM_CODE',
          type: 'str',
          desc: 'GTM code to use for application'
        }
      ]
    })
  })

  const veniaTargets = targets.of('@magento/venia-ui')
  const routes = veniaTargets.routes
  routes.tap(
    routesArray => {
      routesArray.push({
        name: 'Cart',
        pattern: '/cart',
        path: 'src/components/CartPage',
        exact: true
      })

      return routesArray
    }
  )
}