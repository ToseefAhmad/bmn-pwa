import { gql } from '@apollo/client'

export const GET_CATEGORY = gql`
  query GetCategories(
    $id: Int!
    $pageSize: Int!
    $currentPage: Int!
    $filters: ProductAttributeFilterInput!
    $sort: ProductAttributeSortInput
  ) {
    category(id: $id) {
      __typename
      id
      url_path
      description
      name
      product_count
      page_layout
      display_mode
      show_subcategories
      child_categories {
        name
        url
        product_count
        children {
          name
          url
          product_count
          children {
            name
            url
            product_count
          }
        }
      }
      meta_title
      meta_keywords
      meta_description
    }
    products(
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filters
      sort: $sort
    ) {
      aggregations {
        __typename
        label
        count
        attribute_code
        options {
          __typename
          label
          value
        }
      }
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
        # id is always required, even if the fragment includes it.
        id
        # TODO: Once this issue is resolved we can use a
        # GalleryItemFragment here:
        # https://github.com/magento/magento2/issues/28584
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

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`

export default {
  getCategoryQuery: GET_CATEGORY,
  getFilterInputsQuery: GET_FILTER_INPUTS
}
