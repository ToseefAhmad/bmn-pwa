import React, { Fragment } from 'react'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator'
import RichContent from '../../components/RichContent'
import { number, shape, string } from 'prop-types'
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head'
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage'
import { useIntl } from 'react-intl'
import NoRoute from '@bmn/no-route/src/components/NoRoute'

const CMSPage = props => {
  const { identifier } = props

  const talonProps = useCmsPage({ identifier })
  const {
    cmsPage,
    hasContent,
    shouldShowLoadingIndicator
  } = talonProps
  const { formatMessage } = useIntl()

  if (shouldShowLoadingIndicator) {
    return fullPageLoadingIndicator
  }

  if (hasContent) {
    const {
      content_heading,
      title,
      meta_title,
      meta_description,
      content
    } = cmsPage

    const headingElement =
      content_heading !== '' ? (
        <h1>{ content_heading }</h1>
      ) : null

    const pageTitle = meta_title || title

    return (
      <Fragment>
        <StoreTitle>{ pageTitle }</StoreTitle>
        <Meta name="title" content={ pageTitle }/>
        <Meta name="description" content={ meta_description }/>
        { headingElement }
        <RichContent html={ content }/>
      </Fragment>
    )
  }

  // Fallback to a category list if there is no cms content.
  return (
    <NoRoute />
  )
}

CMSPage.propTypes = {
  id: number,
  statusCode: number,
  classes: shape({
    heading: string
  })
}

export default CMSPage
