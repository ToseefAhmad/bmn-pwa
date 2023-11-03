module.exports = componentOverride = {
  [`@magento/venia-ui/lib/components/LoadingIndicator/index.js`]: './src/rewrites/venia-ui/LoadingIndicator/index.js',
  [`@magento/pagebuilder/lib/config.js`]: './src/rewrites/pagebuilder/lib/config.js',
  [`@magento/pagebuilder/lib/ContentTypes/ButtonItem/buttonItem.js`]: './src/rewrites/pagebuilder/lib/ContentTypes/ButtonItem/buttonItem.js',
  [`@magento/pagebuilder/lib/ContentTypes/Row/row.js`]: './src/rewrites/pagebuilder/lib/ContentTypes/Row/row.js',
  [`@magento/pagebuilder/lib/ContentTypes/Row/row.module.css`]: './src/rewrites/pagebuilder/lib/ContentTypes/Row/row.css',
  [`@magento/venia-ui/lib/components/Head/index.js`]: './src/rewrites/venia-ui/Head/index.js',
  [`@magento/venia-ui/lib/components/Checkbox/index.js`]: './src/rewrites/venia-ui/Checkbox/index.js',
};
