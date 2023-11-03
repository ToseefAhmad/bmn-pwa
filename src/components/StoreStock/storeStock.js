import React, { Fragment, useMemo, useState } from 'react'
import { shape, string } from 'prop-types'
import { request } from '@magento/peregrine/lib//RestApi/Magento2/M2ApiRequest'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import Select from "../Select";
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeStock.less'
import t from '@bmn/translate'

const StoreStock = props => {
  const restUrl = '/rest/default/V1/bmn/pickup-stores-stock/'
  const { productSku } = props
  const [ { isSignedIn } ] = useUserContext()
  const classes = mergeClasses(defaultClasses, props.classes)
  const [ stores, setStores ] = useState({
    stores: [],
    selectedStore: '',
    stockAmount: 0
  })

  useMemo(() => {
    if (isSignedIn) {
      const response = request(restUrl + productSku)
      response.then((value) => {
        value.map((child) => {
          let customerStore
          const storesData = []

          if (child.hasOwnProperty('stock_stores')) {
            if (child.hasOwnProperty('selected_store') && child.selected_store !== 0) {
              customerStore = child.stock_stores.filter(function (store) {
                return store.id.toString() === child.selected_store.toString();
              }).map(function (store) {
                return {
                  value: store.id,
                  label: store.name,
                  qty: store.qty
                }
              })
            }

            child.stock_stores.map((storeStock) => {
              storesData.push({
                value: storeStock.id,
                label: storeStock.name + ' (' + storeStock.qty + ')',
                optional: {
                  qty: storeStock.qty
                }
              })
            })
          }

          setStores({
            stores: storesData ? storesData : [],
            selectedStore: customerStore.length > 0 ? customerStore[0] : null,
            stockAmount: customerStore.length > 0 ? customerStore[0].qty : 0
          })
        });
      })
    }
  }, [ productSku, isSignedIn ])

  const getProductAsText = (amount) => {
    return amount === 1 ? 'product' : 'products'
  }

  const callback = (storeId) => {
    const store = stores.stores.filter(function (store) {
      return store.value === storeId;
    });

    setStores({
      stores: stores.stores,
      selectedStore: storeId,
      stockAmount: store[0].optional.qty
    })
  }

  return stores.stores.length > 0 && isSignedIn ?
    <Fragment>
      <div className={ classes.storeStock }>
        <span className={ classes.storeStock__title }>
          { t({ s: 'Pickup at:' }) }
        </span>
        <div className={ classes.storeStock__dropdown_wrapper }>
          <Select
            data={ stores.stores }
            defaultValue={ stores.selectedStore }
            placeholder={ t({ s: 'Select a store' }) }
            callback={ callback }
          />
          {
            stores.selectedStore ?
              <span
                className={ `${ classes.storeStock__stock } ${ stores.stockAmount > 0 ? classes.available : classes.unavailable }` }>
                {
                  stores.stockAmount > 0
                    ? t({ s: '%1 ' + getProductAsText(stores.stockAmount) + ' at stock', r: [ stores.stockAmount ] })
                    : t({ s: 'No stock available' })
                }
              </span>
              : <></>
          }
        </div>
      </div>
    </Fragment> :
    <>
      {
        isSignedIn ?
          <div className={ classes.storeStock }>
            <div className={ classes.loading }>{ t({ s: 'Loading store availability' }) }</div>
          </div> : <></>
      }
    </>
}

StoreStock.propTypes = {
  classes: shape({
    storeStock: string,
    storeStock__dropdown_wrapper: string,
    storeStock__title: string,
    storeStock__stock: string,
    available: string,
    unavailable: string
  }),
  productSku: string.isRequired
}

export default StoreStock
