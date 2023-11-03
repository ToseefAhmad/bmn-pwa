import { gql } from '@apollo/client'

import { ProductDetailsFragment } from './productFullDetailFragment.gql'

export const GET_PRODUCT_DETAIL_QUERY = gql`
  query getProductDetailForProductPage($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        ...ProductDetailsFragment
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
  ${ ProductDetailsFragment }
`

export default {
  getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
}
