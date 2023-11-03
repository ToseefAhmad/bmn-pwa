import React, { Fragment } from 'react'
import { bool, shape, string } from 'prop-types'

import { useScrollLock } from '@magento/peregrine'
import { mergeClasses } from '@magento/venia-ui/lib/classify'

import Footer from '../Footer'
import Header from '../Header'
import defaultClasses from './main.less'
import BeforeFooter from '../BeforeFooter'
import ScrollToTop from "../ScrollToTop"
import PageButtons from '../PageButtons'
import TopMessage from '../TopMessage'
import { useUserContext } from "@magento/peregrine/lib/context/user"
import HeaderNotification from "../CompanyNotification/notification"
import { isNativeApp } from '../../utils/recogniseNativeApp'

const COMPANY_APPROVED = 'APPROVED'

const Main = props => {
  const { children, isMasked } = props
  const classes = mergeClasses(defaultClasses, props.classes)

  const rootClass = isMasked ? classes.root_masked : classes.root
  const pageClass = isMasked ? classes.page_masked : classes.page

  const [{ currentUser, isSignedIn }] = useUserContext()

  const CompanyBlocked = () => {
    if (isSignedIn && currentUser.company_status && currentUser.company_status !== COMPANY_APPROVED) {
      return <HeaderNotification
        status={ String(currentUser.company_status).toLowerCase() }
      />
    }
    return <Fragment />
  }

  useScrollLock(isMasked)

  const isAppEnabled = isNativeApp()

  return (
    <main className={ rootClass }>
      <ScrollToTop />
      <CompanyBlocked/>
      {
        !isAppEnabled
        ? <Fragment>
            <Header/>
            <TopMessage/>
          </Fragment>
        : <Fragment/>
      }
      <div className={ pageClass }>{ children }</div>
      {
        !isAppEnabled
          ? <Fragment>
              <BeforeFooter/>
              <Footer/>
              <PageButtons />
            </Fragment>
          : <Fragment/>
      }
    </main>
  )
}

export default Main

Main.propTypes = {
  classes: shape({
    page: string,
    page_masked: string,
    root: string,
    root_masked: string,
  }),
  isMasked: bool,
}
