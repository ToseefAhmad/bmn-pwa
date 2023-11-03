import React, { useEffect } from 'react'
import { string } from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import RichContent from '../../RichContent'

import GET_CMS_BLOCKS from '../../../queries/getCmsBlocks.graphql'

const CmsBlock = props => {
  let content = <></>
  const {
    blockId,
    fallback
  } = props

  const result = <></>

  const [getCmsBlock, { data, loading, error }] = useLazyQuery(
    GET_CMS_BLOCKS
  )

  useEffect(() => {
    let isFetching = true
    if (blockId !== '') {
      getCmsBlock({ variables: { identifiers: [ blockId ] } })
    }

    return () => {
      isFetching = false
    }
  }, [blockId, getCmsBlock])

  if (blockId === '' || !blockId) {
    return result
  }

  if (loading || error || data === undefined) {
    return result
  }

  const block = data.cmsBlocks.items[0]
  if (block.identifier !== null && block.content !== null) {
    content = <RichContent
      key={ block.identifier }
      html={ block.content }
    />
  } else if (fallback) content = fallback

  return content
}

CmsBlock.propTypes = {
  blockId: string.isRequired,
  fallback: string
}

CmsBlock.defaultProps = {
  fallback: ''
}

export default CmsBlock
