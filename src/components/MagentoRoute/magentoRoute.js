import React from 'react'
import t from '@bmn/translate'
import NoRoute from '../../components/Cms/Page/NoRoute'
import ErrorView from '@magento/venia-ui/lib/components/ErrorView'
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator'

const MESSAGES = new Map()
  .set('NOT_FOUND', 'That page could not be found. Please try again.')
  .set('INTERNAL_ERROR', 'Something went wrong. Please try again.')

const MagentoRoute = () => {
  const talonProps = useMagentoRoute()
  const {
    component: RootComponent,
    id,
    isLoading,
    isNotFound,
    isRedirect
  } = talonProps


  if (isLoading || isRedirect) {
    return fullPageLoadingIndicator
  } else if (RootComponent) {
    return <RootComponent id={ id }/>
  } else if (isNotFound) {
    return (
      <NoRoute/>
    )
  }

  return (
    <ErrorView>
      <h1>
        {
          t({ s: '%1', r: [MESSAGES.get('INTERNAL_ERROR')] })
        }
      </h1>
    </ErrorView>
  )
}

export default MagentoRoute
