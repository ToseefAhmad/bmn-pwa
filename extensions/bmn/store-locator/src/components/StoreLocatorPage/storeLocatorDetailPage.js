import React from 'react'
import { shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocatorDetailPage.css'

import Title from '../../../../../../src/components/Title'
import { useParams } from 'react-router-dom'
import useStoreLocator from '../../talons/store-locator/useStoreLocator'

const StoreLocatorDetailPage = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const { slug } = useParams()
  const { storeLocatorStore } = useStoreLocator({ slug })

  return (
    <div className={ classes.container }>
      <Title
        type={ 'h1' }
        title={ storeLocatorStore.name }
      />
    </div>
  )
}

StoreLocatorDetailPage.propTypes = {
  classes: shape({
    container: string,
  })
}

export default StoreLocatorDetailPage
