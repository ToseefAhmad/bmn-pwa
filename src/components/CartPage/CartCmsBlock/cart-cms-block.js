import React, { useMemo, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import RichContent from '../../RichContent'

import GET_CART_CMS_BLOCK from '../../../queries/getCartCmsBlock.graphql'
import GET_CMS_BLOCKS from '../../../queries/getCmsBlocks.graphql'
import defaultClasses from './cart-cms-block.less'

const CartCmsBlock = () => {
  const [content, setContent] = useState()
  const [
    getIdentifier,
    {
      loading: LoadingIdentifier,
      data: identifier
    }
  ] = useLazyQuery(GET_CART_CMS_BLOCK)
  const [getCmsBlockData, { data }] = useLazyQuery(GET_CMS_BLOCKS)

  useMemo(
    () => {
      const fetchCmsBlock = async () => {
        await getIdentifier()
        if (identifier && identifier.storeConfig.cart_pwa_cms_block) {
          await getCmsBlockData({variables: {identifiers: [identifier.storeConfig.cart_pwa_cms_block]}})
          if (data) {
            setContent(data.cmsBlocks.items[0].content)
          }
        }
      }
      fetchCmsBlock()
    }, [getCmsBlockData, getIdentifier, data, identifier, setContent]
  )

  return (
    <div className={ defaultClasses.cart_cms_block }>
      <RichContent html={ content } />
    </div>
  )
}

export default CartCmsBlock
