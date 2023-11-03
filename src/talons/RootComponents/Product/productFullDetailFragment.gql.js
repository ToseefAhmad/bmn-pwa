import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
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
        technical_specifications {
          key
          value
        }
        attachments {
          file_path
          label
        }
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
        show_direct_price
        show_tier_price
        categories {
            id
            breadcrumbs {
                category_id
            }
        }
        short_description {
            html
        }
        description {
            html
        }
        id
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
        ean_ws
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
                    price_range {
                      maximum_price {
                        final_price {
                          currency
                          value
                        }
                      }
                    }
                }
            }
        }
    }
`;
