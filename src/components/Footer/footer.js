import React from 'react'
import { shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './footer.less'

import { useQuery } from '@apollo/client'
import GET_FOOTER_DATA from '../../queries/getFooterData.graphql'
import FooterColumn from './components/Column'
import SocialColumn from './components/SocialColumn'
import LinkList from '../LinkList/link-list'

const Footer = props => {
  const classes = mergeClasses(defaultClasses, props.classes)

  const { data, loading, error } = useQuery(GET_FOOTER_DATA, {
    fetchPolicy: 'cache-and-network'
  })

  if (loading || error || !data) {
    return (<></>)
  }

  const socialData = {
    title: data.storeConfig.theme_social_title_social,
    facebook: data.storeConfig.theme_social_facebook,
    linkedin: data.storeConfig.theme_social_linkedin,
    youtube: data.storeConfig.theme_social_youtube
  }

  return (
    <footer className={ classes.root }>
      <div className={ classes.footerWrapper }>
        <div className={ classes.footerColumnWrapper }>
          <FooterColumn
            columnTitle={ data.storeConfig.theme_footer_column_title_1 }
            columnItems={ data.storeConfig.theme_footer_column_1 }
          />
          <FooterColumn
            columnTitle={ data.storeConfig.theme_footer_column_title_2 }
            columnItems={ data.storeConfig.theme_footer_column_2 }
          />
          <FooterColumn
            columnTitle={ data.storeConfig.theme_footer_column_title_3 }
            columnItems={ data.storeConfig.theme_footer_column_3 }
          />
          <FooterColumn
            columnTitle={ data.storeConfig.theme_footer_column_title_4 }
            columnItems={ data.storeConfig.theme_footer_column_4 }
          />
        </div>
        <div className={ classes.footerSocialColumnWrapper }>
          <SocialColumn socialData={ socialData }/>
        </div>
      </div>
      <div className={ classes.footerBottom }>
        <div className={ classes.copyright }>
          { data.storeConfig.copyright }
        </div>
        <LinkList items={ data.storeConfig.theme_footer_copyright_links } linkClass={ 'Link__horizontal' }/>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  classes: shape({
    copyright: string,
    footerWrapper: string,
    footerColumnWrapper: string,
    footerSocialColumnWrapper: string,
    root: string,
    footerBottom: string
  })
}

export default Footer
