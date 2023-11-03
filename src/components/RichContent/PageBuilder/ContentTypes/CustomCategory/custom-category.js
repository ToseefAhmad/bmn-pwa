import React from 'react'
import { shape, string } from 'prop-types'
import defaultClasses from './custom-category.less'
import { useQuery } from '@apollo/client'
import GET_EXCEPTIONAL_PAGE_CONFIG from '../../../../../queries/getExceptionalPageConfig.graphql'
import { Link } from 'react-router-dom'
import { toHTML } from '../../custom-utils'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { isInternalUrl, removeBaseUrl } from '../../../../../utils/urlParser'
import { scrollByHash } from '../../../../Anchor/scroll'

const CustomCategory = props => {
  const { data, loading, error } = useQuery(GET_EXCEPTIONAL_PAGE_CONFIG)
  const classes = mergeClasses(defaultClasses, props.classes)

  if (loading || error || !data) {
    return <></>
  }

  const {
    link,
    target,
    desktopImage,
    content
  } = props

  const pageSlug = window.location.pathname.replace('/', '')
  const pageColorConfig = data.storeConfig.exceptional_cms_page_general_identifiers.filter(
    (configItem) => {
      return configItem.exceptional_page_id === pageSlug
    }
  )

  let inlineStyle = {}

  if (pageColorConfig[0]) {
    inlineStyle = {
      '--arrow-button-color': pageColorConfig[0].exceptional_page_default_color
    }
  }
  if (desktopImage) {
    inlineStyle = {
      ...inlineStyle,
      '--arrow-top-position': '-5px'
    }
  }

  const innerContent = <>
    { desktopImage ?
      <div
        className={ classes.customCategoryImage }
        style={ { backgroundImage: `url(${ desktopImage })` } }
      >
      </div> :
      <></>
    }
    <div
      className={ classes.customCategoryContent }
      style={ inlineStyle }
      dangerouslySetInnerHTML={ toHTML(content) }
    >
    </div>
  </>

  return (
    <div className={ classes.wrapper }>
      {
        isInternalUrl(link)
          ? <Link
            to={ removeBaseUrl(link) }
            className={ classes.customCategory }
            onClick={ (evt) => {
              scrollByHash()
            } }
          >
            { innerContent }
          </Link>
          : <a
            href={ link }
            className={ classes.customCategory }
            target={ target }
          >
            { innerContent }
          </a>
      }
    </div>
  )
}

CustomCategory.propTypes = {
  classes: shape({
    customCategory: string,
    customCategoryImage: string,
    customCategoryContent: string,
    wrapper: string
  }),
  contentType: string,
  appearance: string,
  desktopImage: string,
  link: string,
  content: string
}

export default CustomCategory
