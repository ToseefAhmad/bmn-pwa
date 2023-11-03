import { gql } from '@apollo/client'

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
      id
      meta_title
      meta_keywords
      meta_description
      page_layout
      display_mode
    }
`

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
    crh_data {
        __typename
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
        items {
          id
          uid
          name
          inventory_unit {
            is_complex
            packaging_unit
            packaging_amount
            price_per_unit
            real_inventory_unit
            square_meter
            unit_type
            is_mandatory_packaging
            major_packaging_unit
            major_packaging_amount
          }
          stock_notice {
            color
            text
          }
          saleable_segment {
            segment_ids
            message
          }
          productLabels {
            status
            name
            label_type
            background_color
            label_text
            color
            image
            alt_text
          }
          price_range {
            maximum_price {
              final_price {
                currency
                value
              }
            }
          }
          sku
          small_image {
            url
          }
          stock_status
          type_id
          url_key
        }
        page_info {
          total_pages
        }
        total_count
    }
`
