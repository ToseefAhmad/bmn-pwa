import React from 'react'
import defaultClasses from './custom-project.less'
import { useQuery } from '@apollo/client'
import GET_EXCEPTIONAL_PAGE_CONFIG from '../../../../../queries/getExceptionalPageConfig.graphql'
import { toHTML } from '../../custom-utils'
import { isInternalUrl, removeBaseUrl } from '../../../../../utils/urlParser'
import { Link } from 'react-router-dom'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { shape, string } from 'prop-types'

const CustomProject = props => {
  const { data, loading, error } = useQuery(GET_EXCEPTIONAL_PAGE_CONFIG)
  const classes = mergeClasses(defaultClasses, props.classes)

  if (loading || error || !data) {
    return <></>
  }

  const {
    desktopImage,
    link,
    content
  } = props

  const pageSlug = window.location.pathname.replace('/', '')
  const pageColorConfig = data.storeConfig.exceptional_cms_page_general_identifiers.filter(
    (configItem) => {
      return configItem.exceptional_page_id === pageSlug

    }
  )
  let pageColor = {}
  if (pageColorConfig.length) {
    pageColor = { '--arrow-button-color': pageColorConfig[0].exceptional_page_default_color }
  }

  const innerContent = <>
    <div
      className={ classes.customProjectsImage }
      style={ { backgroundImage: `url(${ desktopImage })` } }
    >
    </div>
    <div className={ classes.customProjectsContent }>
      <div
        style={ pageColor }
        dangerouslySetInnerHTML={ toHTML(content) }
      >
      </div>
    </div>
  </>

  return <div>
    {
      isInternalUrl(link)
        ? <Link
          to={ removeBaseUrl(link) }
          className={ classes.customProjectsWrapper }
        >
          { innerContent }
        </Link>
        : <a
          href={ link }
          className={ classes.customProjectsWrapper }
          target={ '_blank' }
        >
          { innerContent }
        </a>
    }
  </div>
}

CustomProject.propTypes = {
  classes: shape({
    customProjectsWrapper: string,
    customProjectsImage: string,
    customProjectsContent: string
  }),
  contentType: string,
  appearance: string,
  desktopImage: string,
  link: string,
  content: string
}

export default CustomProject
