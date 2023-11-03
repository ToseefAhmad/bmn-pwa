import React from 'react'
import { useQuery } from '@apollo/client'
import Cms from '../../../../RootComponents/CMS'
import GET_CMS_CONFIG from '../../../../queries/getCmsConfig.graphql'
import GET_CMS_PAGE from '../../../../queries/getCmsPage.graphql'

const NoRoute = () => {
  let noRouteIdentifier
  const { data: cmsConfigData } = useQuery(GET_CMS_CONFIG)

  if (cmsConfigData && 'storeConfig' in cmsConfigData) {
    noRouteIdentifier = cmsConfigData.storeConfig.cms_no_route
  }

  const {
    loading,
    error,
    data
  } = useQuery(GET_CMS_PAGE, {
    variables: {
      identifier: noRouteIdentifier,
      onServer: false
    }
  })

  if (loading || error || !data) {
    return <></>
  }

  return (
    <Cms
      id={ Number(data.cmsPage.page_id) }
      statusCode={ 404 }
    />
  )
}

export default NoRoute
