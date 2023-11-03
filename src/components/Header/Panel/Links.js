import React from 'react'
import { useQuery } from '@apollo/client'
import PanelLink from './Links/PanelLink'
import defaultClasses from './links.less'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import GET_HEADER_LINK_CONFIG from '../../../queries/getHeaderConfigData.graphql'
import { func, shape, string } from 'prop-types'

const Links = props => {
  const { onLinkClick } = props
  const classes = mergeClasses(defaultClasses, props.classes)
  const { data, loading, error } = useQuery(GET_HEADER_LINK_CONFIG)

  if (loading || error || !data) {
    return null
  }

  return <ul className={ classes.panelHeaderLinks }>
    {
      data.headerConfig.pages.map(link =>
        <PanelLink
          key={ link.page_id }
          onClick={ onLinkClick }
          link={ link }
        />
      )
    }
  </ul>
}

Links.propTypes = {
  onLinkClick: func,
  classes: shape({
    panelHeaderLinks: string
  })
}

export default Links
