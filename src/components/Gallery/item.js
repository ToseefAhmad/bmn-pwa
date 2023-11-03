import React from 'react'
import { bool, func, number, shape, string, arrayOf, array } from 'prop-types'
import { Link } from 'react-router-dom'
import resourceUrl from '@magento/peregrine/lib/util/makeUrl'
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images'
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage'
import AddToCart from '../Catalog/addToCart'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import Image from '../Image'
import defaultClasses from './item.less'
import pricingClasses from '../Price/pricing.less'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import t from '@bmn/translate'
import StockNotice from '../StockNotice'
import InventoryUnit from '../InventoryUnit/inventory-unit'
import ProductLabel from '../ProductLabel'
import globalStyles from '../../web/globals.less'

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 200
const IMAGE_HEIGHT = 200

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
  .set(640, IMAGE_WIDTH)
  .set(UNCONSTRAINED_SIZE_KEY, 840)

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = ''

const ItemPlaceholder = ({ classes }) => (
  <div className={ classes.root_pending }>
    <div className={ classes.images_pending }>
      <Image
        alt="Placeholder for gallery item image"
        classes={ {
          image: classes.image_pending,
          root: classes.imageContainer
        } }
        src={ transparentPlaceholder }
      />
    </div>
    <div className={ classes.name_pending }/>
    <div className={ classes.price_pending }/>
  </div>
)

const GalleryItem = props => {
  const {
    item,
    sliderEnabled,
    hasBorder,
    addToCartModalButtons,
    disableButton,
    showModal
  } = props
  const [{ isSignedIn }] = useUserContext()
  const classes = mergeClasses(defaultClasses, props.classes)

  if (!item) {
    return <ItemPlaceholder classes={ classes }/>
  }

  const {
    name,
    small_image,
    url_key,
    inventory_unit = {},
    stock_notice,
    getRealTimePrice
  } = item

  const basePrice = getRealTimePrice(item.sku, 'base')
  const complexPrice = getRealTimePrice(item.sku, 'complex')

  const baseRealTimePrice = basePrice && basePrice.price ? basePrice : ''
  const complexRealTimePrice = complexPrice && complexPrice.price ? complexPrice : ''

  const productLink = resourceUrl(`/${ url_key }${ productUrlSuffix }`)
  const borderClasses = hasBorder ?  `${ classes.root } ${ classes.borderBottom }`  :  classes.root  ;

  return (
    <div className={ borderClasses }>
      <div className={ classes.mainWrapper }>
        <div className={ classes.imageWrapper }>
          <ProductLabel
            productLabels={ item.productLabels }
            inMediaGallery={ false }
          />
          <Link to={ productLink } className={ classes.images }>
            <Image
              alt={ name }
              classes={ {
                image: classes.image,
                root: classes.imageContainer
              } }
              height={ IMAGE_HEIGHT }
              resource={ small_image }
              widths={ IMAGE_WIDTHS }
            />
          </Link>
        </div>
        <Link to={ productLink } className={ classes.name }>
          <span>{ name }</span>
        </Link>
      </div>
      <div className={ classes.bottomWrapper }>
        { isSignedIn ?
          <div className={ defaultClasses.pricingContainer }>
            <div className={ `${ pricingClasses.priceWrapper } ${ pricingClasses.listing }` }>
              {
                baseRealTimePrice
                  ? <div className={ pricingClasses.priceWrapperFinalPrice }>
                    { baseRealTimePrice.price }
                  </div>
                  : <div className={ pricingClasses.priceWrapperFinalPrice }>
                    <span className={ globalStyles.loading }>{ t({ s: 'Loading' }) }</span>
                  </div>
              }
              {
                complexRealTimePrice
                  ? <div
                    className={ `${ pricingClasses.priceWrapperComplexPrice } ${ pricingClasses.priceWrapperComplexPriceOverview }` }>
                    { complexRealTimePrice.price }
                    {
                      complexRealTimePrice.extra
                        ? <span className={ pricingClasses.suffix }>{ complexRealTimePrice.extra }</span>
                        : null
                    }
                  </div>
                  : null
              }
            </div>
            <span className={ pricingClasses.exVat }>{ t({ s: 'excl. vat' }) /* @todo: get this from config */ }</span>
          </div>
          : <></>
        }
        <StockNotice
          classes={
            { onlineStockWrapper: classes.deliveryNotice }
          }
          color={ stock_notice.color }
          text={ stock_notice.text }
        />
        <AddToCart
          item={ item }
          sliderEnabled={ sliderEnabled }
          addToCartModalButtons = { addToCartModalButtons }
          disableButton={ disableButton }
          showModal={ showModal }
          qtyWrapperChildren={
            <div className={ classes.inner }>
              <InventoryUnit
                isComplex={ inventory_unit.is_complex }
                packagingAmount={ inventory_unit.packaging_amount }
                packagingUnit={ inventory_unit.packaging_unit }
                realInventoryUnit={ inventory_unit.real_inventory_unit }
                squareMeter={ inventory_unit.square_meter }
                unitType={ inventory_unit.unit_type }
                pricePerUnit={ inventory_unit.price_per_unit }
                isMandatoryPackaging={ inventory_unit.is_mandatory_packaging }
                fontSize={ '12px' }
              />
            </div>
          }
        />
      </div>
    </div>
  )
}


GalleryItem.defaultProps = {
  addToCartModalButtons: [],
  showModal: true
}

export default GalleryItem
