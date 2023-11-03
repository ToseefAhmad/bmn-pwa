import { gql } from '@apollo/client'

export const ProductSearch = gql`
    query ProductSearch(
        $currentPage: Int = 1
        $inputText: String!
        $pageSize: Int = 6
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        products(
            currentPage: $currentPage
            pageSize: $pageSize
            search: $inputText
            filter: $filters
            sort: $sort
        ) {
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
              # Once graphql-ce/1027 is resolved, use a ProductDetails fragment here instead.
              __typename
              description {
                  html
              }
              id
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
              media_gallery_entries {
                  id
                  label
                  position
                  disabled
                  file
              }
              meta_title
              meta_keyword
              meta_description
              name
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
              url_key
              ... on ConfigurableProduct {
                  configurable_options {
                      attribute_code
                      attribute_id
                      id
                      label
                      values {
                          default_label
                          label
                          store_label
                          use_default_value
                          value_index
                          swatch_data {
                              ... on ImageSwatchData {
                                  thumbnail
                              }
                              value
                          }
                      }
                  }
                  variants {
                      attributes {
                          code
                          value_index
                      }
                      product {
                          id
                          media_gallery_entries {
                              id
                              disabled
                              file
                              label
                              position
                          }
                          sku
                          stock_status
                      }
                  }
              }
          }
            page_info {
                total_pages
            }
            total_count
        }
    }
`
