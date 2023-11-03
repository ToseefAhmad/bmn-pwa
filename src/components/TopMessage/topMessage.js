import React from 'react'
import { useQuery } from '@apollo/client'
import CmsBlock from '../Cms/Block'
import GET_TOP_MESSAGE_DATA from '../../queries/getTopMessageConfig.graphql'

const TopMessage = () => {
  let content = <></>
  const {
    data,
    loading,
    error
  } = useQuery(GET_TOP_MESSAGE_DATA)

  if (loading || error || !data) {
    return content
  }

  const identifier = data.storeConfig.theme_header_top_message
  if (identifier) content = <CmsBlock blockId={ identifier }/>

  return content
}

export default TopMessage
