import React from 'react'
import { shape, string } from 'prop-types'
import classNames from './beforeFooter.less'
import { useQuery } from '@apollo/client'
import GET_FOOTER_CONFIG_DATA from '../../queries/getFooterData.graphql'
import { Link } from 'react-router-dom'
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Message from './Message'

const BeforeFooter = () => {
  const {
    data,
    loading,
    error
  } = useQuery(GET_FOOTER_CONFIG_DATA)

  if (loading || error || !data) {
    return (<></>)
  }

  const storeTitle = data.storeConfig.default_title
  const footerLogoUrl = data.storeConfig.theme_footer_above_footer_logo
  const footerLinks = data.storeConfig.theme_footer_above_footer_links.map((footerLink, key) => {
    return <li key={ key }>
      <Link to={ footerLink.url }>{ footerLink.title }</Link>
    </li>
  })

  return (
    <div className={ classNames.root }>
      <Message
        config={ data.storeConfig }
      />
      <div className={ classNames.wrapper }>
        <div className={ classNames.inner }>
          <img
            src={ resourceUrl(footerLogoUrl, { type: 'image-wysiwyg', quality: 85 }) }
            alt={ storeTitle }
            title={ storeTitle }
          />
          <ul className={ classNames.links }>
            { footerLinks }
          </ul>
        </div>
      </div>
    </div>
  )
}

BeforeFooter.propTypes = {
  classes: shape({
    root: string,
    wrapper: string,
    inner: string,
    links: string
  })
}

export default BeforeFooter
