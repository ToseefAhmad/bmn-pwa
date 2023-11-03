import { gql } from '@apollo/client'

export const GET_PRODUCT_REAL_TIME_PRICING = gql`
  query getProductRealTimePricing($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        __typename
        id      
      }
      crh_data {
        base {
          mainProductSku
          actionName
          multiSku
          skuData {
            product_id
            sku
            aofak
            qty
            htmlType
            baseHtml
            complexPrice
          }
          worksiteId
        }
        complex {
          mainProductSku
          actionName
          multiSku
          skuData {
            product_id
            sku
            aofak
            qty
            htmlType
            baseHtml
            complexPrice
          }
          worksiteId
        }
        direct {
          main_product_sku
          sku
        }
        tier {
          main_product_sku
          qty
          sku
        }
      }
    }
  }
`
export default {
  getProductRealTimePricing: GET_PRODUCT_REAL_TIME_PRICING
}
