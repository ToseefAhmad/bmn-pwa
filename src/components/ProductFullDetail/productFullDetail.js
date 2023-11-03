import React, { Fragment, Suspense, useCallback } from 'react'
import { arrayOf, bool, number, shape, string } from 'prop-types'
import { useProductFullDetail } from './useProductFullDetail'
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import Breadcrumbs from '../Breadcrumbs'
import t from '@bmn/translate'
import DescriptionList from '../DescriptionList'
import StoreStock from '../StoreStock'
import ProductAttachment from '../ProductAttachment'
import Carousel from '../Carousel'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator'
import RichText from '../RichText'
import LinkedProduct from '../LinkedProduct'
import { LINKED_PRODUCT_CROSSSELL, LINKED_PRODUCT_RELATED, LINKED_PRODUCT_UPSELL } from '../LinkedProduct/linkedProduct'
import defaultClasses from './productFullDetail.less'
import {
  ADD_CONFIGURABLE_MUTATION,
  ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql'
import AddToCart from '../Catalog/addToCart'
import Button, { BUTTON_TYPE_ACTION } from '../Button'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import GET_STORE_LOCATOR_CONFIG_DATA from '../../queries/getStoreLocatorConfig.graphql'
import { useQuery } from '@apollo/client'
import InventoryUnit from '../InventoryUnit'
import Table from '../Table'
import StockNotice from '../StockNotice'
import ProductLabel from '../ProductLabel'
import { generateUrlFromContainerWidth } from '@magento/venia-ui/lib/util/images'
import { useRealTimePricing } from '../../talons/RealTimePricing/useRealTimePricing'
import { useInventoryUnit } from '../../talons/InventoryUnit/useInventoryUnit'
import pricingClasses from '../Price/pricing.less'
import { majorPackaging } from './Packaging/major-packaging'
import { realTimePrice } from './Pricing/real-time-price'
import { useLinkedProducts } from '../../talons/LinkedProducts/useLinkedProducts'
import TinySlider from '../Carousel/tiny-slider'
import { useAppContext } from '@magento/peregrine/lib/context/app'
import { isNativeApp } from '../../utils/recogniseNativeApp'
import { useProductFullDetailRealTimePrice } from '../../talons/RealTimePricing/useProductFullDetailRealTimePrice'

const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'))

const sliderConfig = {
  ...TinySlider.defaultProps.settings,
  lazyload: true,
  mouseDrag: true,
  loop: true,
  items: 1,
  nav: true,
  navAsThumbnails: true,
  navContainer: '#thumbs',
  navPosition: 'bottom'
}

const ProductFullDetail = props => {
  const { data, loading, error } = useQuery(GET_STORE_LOCATOR_CONFIG_DATA)
  const { product, crhData } = props
  const { getRealTimePrice } = useProductFullDetailRealTimePrice({
    realTimePricing: crhData
  })

  const isAppEnabled = isNativeApp()
  const [{ isSignedIn }] = useUserContext()

  let storeLocatorUrl
  if (loading || error || !data) {
    storeLocatorUrl = '/stores'
  }

  if (data && data.storeConfig) {
    storeLocatorUrl = data.storeConfig.store_locator_general_store_url
  }

  const talonProps = useProductFullDetail({
    addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
    addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
    product
  })

  const productSkuArray = [product.sku]

  const relatedProductsTalon = useLinkedProducts({
    productSkus: productSkuArray,
    type: LINKED_PRODUCT_RELATED
  })

  const upsellProductsTalon = useLinkedProducts({
    productSkus: productSkuArray,
    type: LINKED_PRODUCT_UPSELL
  })

  const crosssellProductsTalon = useLinkedProducts({
    productSkus: productSkuArray,
    type: LINKED_PRODUCT_CROSSSELL
  })

  const {
    products: relatedProducts,
    crhData: relatedCrhData
  } = relatedProductsTalon

  const {
    products: upsellProducts,
    crhData: upsellCrhData
  } = upsellProductsTalon

  const {
    products: crosssellProducts,
    crhData: crosssellCrhData
  } = crosssellProductsTalon

  const {
    breadcrumbCategoryId,
    handleSelectionChange,
    mediaGalleryEntries,
    productDetails
  } = talonProps

  const {
    stock_notice,
    inventory_unit = {},
    technical_specifications
  } = product

  const { getMajorPackagingText } = useInventoryUnit({ inventory_unit })
  const [{ isPageLoading }] = useAppContext()

  const classes = mergeClasses(defaultClasses, props.classes)

  const options = isProductConfigurable(product) ? (
    <Suspense fallback={ fullPageLoadingIndicator }>
      <Options
        onSelectionChange={ handleSelectionChange }
        options={ product.configurable_options }
      />
    </Suspense>
  ) : null

  const breadcrumbs = breadcrumbCategoryId && !isAppEnabled ? (
    <Breadcrumbs
      categoryId={ breadcrumbCategoryId }
      currentProduct={ productDetails.name }
    />
  ) : null

  const imageNodes = mediaGalleryEntries.map(
    (mediaItem, index) => {
      const imageUrl = new URL(
        generateUrlFromContainerWidth(mediaItem.file, 640),
        location.origin
      ).href

      const label = mediaItem.label !== null
        ? mediaItem.label
        : t({ s: 'Product image for %1', r: [productDetails.name] })

      return (
        <div key={ index }>
          <img
            src={ imageUrl }
            alt={ label }
          />
        </div>
      )
    }
  )

  const basePrice = getRealTimePrice(product.sku, 'base')
  const complexPrice = getRealTimePrice(product.sku, 'complex', true)
  const tierPriceData = getRealTimePrice(product.sku, 'tier', true)

  const directPrice = realTimePrice({
    sku: product.sku,
    type: 'tier',
    visible: product.show_direct_price,
    label: t({ s: 'Direct price' }),
    hideLoading: true
  })

  const tierPrice = realTimePrice({
    crhData,
    sku: product.sku,
    type: 'tier',
    visible: product.show_tier_price,
    label: t({ s: 'Extra discount from' }),
    labelSuffix: getMajorPackagingText(),
    hideLoading: true
  })

  const showTierPrice = useCallback(() => {
    if (tierPriceData) {
      if (complexPrice.rawPrice !== '') {
        return parseFloat(complexPrice.rawPrice) > parseFloat(tierPriceData.rawPrice)
      }

      if (basePrice.rawPrice !== '') {
        return parseFloat(basePrice.rawPrice) > parseFloat(tierPriceData.rawPrice)
      }
    }

    return false
  }, [
    basePrice,
    complexPrice,
    tierPriceData
  ])

  const packaging = majorPackaging({
    inventory_unit: inventory_unit
  })

  return (
    <Fragment>
      { breadcrumbs }
      <div className={ `${ classes.container } ${ classes.container__100 }` }>
        {/* Media Gallery */ }
        <section className={ `${ classes.container__50 } ${ classes.media_gallery }` }>
          <ProductLabel
            productLabels={ product.productLabels }
            inMediaGallery={ true }
          />
          {
            imageNodes && imageNodes.length
              ? <Carousel
                settings={ sliderConfig }
                showButtons={ true }
                type={ 'image' }
                thumbs={ true }
              >
                { imageNodes }
              </Carousel>
              : <div className={ classes.center }>
                <img src={ '/bmn-static/images/bmn_geen_afbeelding.jpg' } alt={ 'Placeholder' }/>
              </div>
          }
        </section>
        <section className={ `${ classes.container__50 } ${ classes.title }` }>
          {
            !isAppEnabled
              ? <Fragment>
                <h1 className={ classes.pdp__h1 }>
                  { productDetails.name }
                </h1>
              </Fragment>
              : <Fragment/>
          }
          <div className={ classes.title__attributes }>
            <DescriptionList
              data={ [
                { [t({ s: 'SKU' })]: product.sku },
                { [t({ s: 'EAN' })]: product.ean_ws }
              ] }
            />
          </div>
          {product && product.short_description ? (
            <div className={ classes.short_description }>
              {/* Product Short Description */ }
              <RichText content={ product.short_description.html }/>
            </div>
          ) : null}

        </section>
        {/* Product Info Main */ }
        <section className={ `${ classes.container__50 } ${ classes.product_info }` }>
          <div className={ classes.container__bg_gray }>
            {
              isSignedIn
                ? <Fragment>
                  <div className={ `${ pricingClasses.priceWrapper } ${ pricingClasses.detail }` }>
                    <div className={ pricingClasses.priceWrapperFinalPrice }>
                      { basePrice.price }
                      <span className={ pricingClasses.suffix }>
                        { basePrice.extra }
                        </span>
                    </div>
                    {
                      complexPrice.price
                        ? <div className={ pricingClasses.priceWrapperComplexPrice }>
                          { complexPrice.price }
                          <span className={ pricingClasses.suffix }>
                            { complexPrice.extra }
                          </span>
                        </div>
                        : null
                    }
                  </div>
                  {
                    directPrice || tierPrice || packaging
                      ? <div className={ pricingClasses.priceWrapperExtraInfo }>
                        <input
                          type="checkbox"
                          name="toggle-extra-info"
                          id="toggle-extra-info"
                        />
                        <label htmlFor="toggle-extra-info">
                          <span>{ t({ s: 'Extra price information' }) }</span>
                        </label>
                        <div className={ pricingClasses.extraPriceInfoToggle }>
                          { directPrice ? directPrice : '' }
                          { showTierPrice() ? tierPrice : '' }
                          { packaging ? packaging : '' }
                        </div>
                      </div>
                      : ''
                  }
                </Fragment>
                : <Fragment/>
            }
            <div>
              <div>{ options }</div>
            </div>
            {/* Add to cart */ }
            <div>
              <AddToCart
                item={ product }
                buttonText={ t({ s: 'Add to shopping cart' }) }
                type={ 'detail' }
                requisitionPosition={ 'icon-right' }
                disableButton={ isPageLoading }
                classes={ { requisitionListingAdditional: classes[`requisition__list--detail`] } }
                qtyWrapperChildren={
                  isSignedIn ?
                    <Fragment>
                      <div className={ classes.qtyUnit }>
                        <span className={ classes.qty }>x</span>
                        <InventoryUnit
                          type={ 'detail' }
                          isComplex={ inventory_unit.is_complex }
                          packagingUnit={ inventory_unit.packaging_unit }
                          packagingAmount={ inventory_unit.packaging_amount }
                          realInventoryUnit={ inventory_unit.real_inventory_unit }
                          unitType={ inventory_unit.unit_type }
                          squareMeter={ inventory_unit.square_meter }
                          pricePerUnit={ inventory_unit.price_per_unit }
                          isMandatoryPackaging={ inventory_unit.is_mandatory_packaging }
                        />
                      </div>
                    </Fragment>
                    : <></>
                }
              />
              {
                isSignedIn ?
                  <></> :
                  <div className={ classes.ask_via_store }>
                    <Button
                      type={ BUTTON_TYPE_ACTION }
                      cssClass={ 'tertiary' }
                      url={ storeLocatorUrl }
                    >
                      <span className={ classes.center }> { t({ s: 'Request price at a store' }) } </span>
                    </Button>
                  </div>
              }
            </div>
            {
              isSignedIn && stock_notice && stock_notice.text
                ? <div className={ classes.stockNotice }>
                  <StockNotice
                    color={ stock_notice.color }
                    text={ stock_notice.text }
                    showIcon={ true }
                    bold={ true }
                  />
                </div>
                : ''
            }
          </div>
          <StoreStock
            productSku={ product.sku }
          />
        </section>
        {
          productDetails.description ?
            <section className={ `${ classes.container__50 } ${ classes.description }` }>
              <h2 className={ classes.pdp__h2 }>
                { t({ s: 'Product information' }) }
              </h2>
              <RichText content={ productDetails.description }/>
            </section> : <></>
        }
      </div>
      <div className={ `${ classes.container } ${ classes.container__100 } ${ classes.container__flex }` }>
        {
          technical_specifications && technical_specifications.length > 0 ?
            <div className={ classes.container__50 }>
              <section className={ classes.container__100 }>
                <h2 className={ classes.pdp__h2 }>
                  { t({ s: 'Technical specifications' }) }
                </h2>
                <Table
                  data={ technical_specifications }
                />
              </section>
            </div> : <></>
        }
        <div className={ classes.container__50 }>
          <section className={ classes.container__100 }>
            <ProductAttachment
              product={ product }
            />
          </section>
        </div>
      </div>
      {
        crosssellProducts && crosssellProducts.length > 0 && crosssellCrhData ?
          <div className={ `${ classes.container } ${ classes.container__100 } ${ classes.container__flex }` }>
            <section className={ classes.container__100 }>
              <h2 className={ classes.pdp__h2 }>
                { t({ s: 'More choices' }) }
              </h2>
              <LinkedProduct
                items={ crosssellProducts }
                crhData={ crosssellCrhData }
              />
            </section>
          </div>
          : <Fragment/>
      }
      {
        relatedProducts && relatedProducts.length > 0 && relatedCrhData ?
          <div className={ `${ classes.container } ${ classes.container__100 } ${ classes.container__flex }` }>
            <section className={ classes.container__100 }>
              <h2 className={ classes.pdp__h2 }>
                { t({ s: 'Related products' }) }
              </h2>
              <LinkedProduct
                items={ relatedProducts }
                crhData={ relatedCrhData }
              />
            </section>
          </div>
          : <></>
      }
      {
        upsellProducts && upsellProducts.length > 0 && upsellCrhData ?
          <div className={ `${ classes.container } ${ classes.container__100 } ${ classes.container__flex }` }>
            <section className={ classes.container__100 }>
              <h2 className={ classes.pdp__h2 }>
                { t({ s: 'Upsell products' }) }
              </h2>
              <LinkedProduct
                items={ upsellProducts }
                crhData={ upsellCrhData }
              />
            </section>
          </div>
          : <Fragment/>
      }
    </Fragment>
  )
}

ProductFullDetail.propTypes = {
  classes: shape({
    ask_via_store: string,
    center: string,
    container: string,
    container__50: string,
    container__100: string,
    container__flex: string,
    container__bg_gray: string,
    pdp__h1: string,
    pdp__h2: string,
    title__attributes: string,
    media_gallery: string,
    title: string,
    product_info: string,
    description: string,
    qty: string,
    qtyUnit: string,
    stockNotice: string
  }),
  product: shape({
    __typename: string,
    id: number,
    sku: string,
    ean_ws: string,
    media_gallery_entries: arrayOf(
      shape({
        label: string,
        position: number,
        disabled: bool,
        file: string.isRequired
      })
    ),
    technical_specifications: arrayOf(
      shape({
        key: string.isRequired,
        value: string.isRequired
      })
    ),
    productLabels: arrayOf(
      shape({
        status: string,
        name: string,
        label_type: string,
        background_color: string,
        label_text: string,
        color: string,
        image: string,
        alt_text: string
      })
    ),
    description: string,
    inventory_unit: shape({
      is_complex: bool,
      packaging_unit: string,
      packaging_amount: string,
      real_inventory_unit: string,
      unit_type: string,
      square_meter: string,
      price_per_unit: string,
      is_mandatory_packaging: string
    }),
    show_direct_price: bool,
    show_tier_price: bool
  }).isRequired
}

export default ProductFullDetail
