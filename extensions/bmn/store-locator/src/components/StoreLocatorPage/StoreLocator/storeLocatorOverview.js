import React from 'react'
import { shape, string } from 'prop-types'

import CmsBlock from '../../../../../../../src/components/Cms/Block'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './storeLocatorOverview.css'

const StoreLocatorOverview = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const { blockId } = props

  return blockId ?
    <div className={ classes.sl__overview }>
      <CmsBlock blockId={ blockId }/>
    </div> :
    <></>
}

StoreLocatorOverview.propTypes = {
  blockId: string,
  classes: shape({
    sl__overview: string
  })
}

export default StoreLocatorOverview
