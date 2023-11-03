module.exports = (targets) => {
  const { Targetables } = require("@magento/pwa-buildpack")
  const targetables = Targetables.using(targets)

  targetables.setSpecialFeatures("esModules", "cssModules")
  const useProduct = targetables.esModule(
    '@magento/peregrine/lib/talons/RootComponents/Product/useProduct.js'
  )

  useProduct.wrapWithFile(
    'useProduct',
    '@bmn/real-time-pricing/src/talons/peregrine/RootComponents/Product/useProduct'
  )
}
