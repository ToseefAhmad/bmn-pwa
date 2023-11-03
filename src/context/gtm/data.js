export const dataLayerConfig = {
  reset: {
    product: () => ({
      ecommerce: undefined,
      items: undefined
    }),
    category: () => ({
      ecommerce: undefined,
      items: undefined
    })
  },
  product: data => ({
    event: 'virtualPageview',
    pagePath: window.location.href,
    pageTitle: `${ data.name } - ${ STORE_NAME }`,
    pageType: 'product',
    items: [
      {
        id: data.sku
      }
    ],
    ecommerce: {
      detail: {
        products: [
          {
            name: data.name,
            id: data.sku
          }
        ]
      }
    }
  }),
  cms: data => ({
    event: 'virtualPageview',
    pagePath: window.location.href,
    pageTitle: `${ data.title } - ${ STORE_NAME }`,
    pageType: 'cms'
  }),
  category: data => ({
    event: 'virtualPageview',
    pagePath: window.location.href,
    pageTitle: `${ data.category.name } - ${ STORE_NAME }`,
    pageType: 'category'
  }),
  removeFromCart: data => ({
    event: 'removeFromCart',
    ecommerce: {
      remove: {
        products: [
          {
            name: data.name,
            id: data.sku,
            quantity: data.quantity
          }
        ]
      }
    }
  }),
  addToCart: data => ({
    event: 'addToCart',
    items: [
      {
        id: data.sku
      }
    ],
    ecommerce: {
      add: {
        products: [
          {
            name: data.name,
            id: data.sku,
            quantity: data.quantity
          }
        ]
      }
    }
  })
}