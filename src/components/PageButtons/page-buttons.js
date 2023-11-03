import React from 'react'
import CircleButton from '../CircleButton'
import { useQuery } from '@apollo/client'
import { Mail } from 'react-feather'
import classNames from './page-buttons.less'
import pageButtonsQuery from '../../queries/getPageButtonsData.graphql'
import ScrollToTopButton from './scroll-to-top-button'

const PageButtons = () => {
  const { data, loading, error } = useQuery(pageButtonsQuery)

  if (loading || error || !data) {
    return (
      <></>
    )
  }

  const ContactButton = () => {
    let button = (<></>)
    if (data.storeConfig.theme_page_buttons_contact_button) {
      button = (
        <CircleButton
          className={ classNames.mailIcon }
          destination={ data.storeConfig.theme_page_buttons_contact_url }
        >
          <Mail stroke={ '#000000' }/>
        </CircleButton>
      )
    }
    return button
  }

  return (
    <div className={ classNames.pageButtons }>
      <ContactButton/>
      <ScrollToTopButton data={ data }/>
    </div>
  )
}

export default PageButtons
