import gql from 'graphql-tag';

export const ProductListingFragment = gql`
  fragment ProductListingFragment on Cart {
    id
    items {
      id
      crh_data {
        unit_price
        price_unit
        stock_unit
      }
      product {
        id
        name
        sku
        small_image {
          url
        }
        thumbnail {
          url
        }
        url_key
        url_suffix
        stock_status
        stock_notice {
          color
          text
        }
        saleable_segment {
          segment_ids
          message
        }
        inventory_unit {
          is_complex
          packaging_unit
          packaging_amount
          price_per_unit
          real_inventory_unit
          square_meter
          unit_type
        }
      }
      prices {
        price {
          currency
          value
        }
        row_total {
          currency
          value
        }
      }
      quantity
      ... on ConfigurableCartItem {
        configurable_options {
          id
          option_label
          value_id
          value_label
        }
      }
    }
  }
`;
