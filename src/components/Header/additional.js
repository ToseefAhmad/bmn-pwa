import React, { useCallback, useRef, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import { shape, string } from 'prop-types'
import defaultClasses from './additional.less'
import t from '@bmn/translate'
import CustomerAccount from './customerAccount'
import StoreLocatorIconLink from '../StoreLocatorPage/StoreLocator/storeLocatorIconLink'
import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger'
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import SignInModal from '../Customer/signInModal'
import {isNativeApp} from "../../utils/recogniseNativeApp";
import {EXACT_URL_LOGIN} from "../Routes/routes";


const Additional = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const [{ isSignedIn }] = useUserContext()

  const node = useRef(null)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)

    const { itemCount } = useCartTrigger({
    queries: {
      getItemCountQuery: GET_ITEM_COUNT_QUERY
    }
  })
    const history = useHistory()

    const toggleLoginModal = () => {
        if (isNativeApp()) {
            history.push(EXACT_URL_LOGIN)
        } else {
            setIsLoginModalVisible(!isLoginModalVisible)
        }
    }

    const disableLoginModal = () => {
        if (isNativeApp()) {
            history.push(EXACT_URL_LOGIN)
        } else {
            setIsLoginModalVisible(false)
        }
    }

  const hasItems = itemCount > 0
  let throttle

  const clickHandler = e => {
    /** @type { Element } **/
    const currentNode = node.current

    if (
      currentNode &&
      !currentNode.contains(e.target)
    ) {
      setAccountMenuOpen(false)
      unbindEvents()
    }
  }

  const monitorScreenWidth = () => {
    clearTimeout(throttle)

    setTimeout(() => {
      if (window.innerWidth < 1024) {
        setAccountMenuOpen(false)
        unbindEvents()
      }
    }, 1000)
  }

  const drawCustomerMenu = e => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      e.preventDefault()
      toggleCustomerMenu()
    }
  }

  const bindEvents = () => {
    window.addEventListener('resize', monitorScreenWidth)
    document.body.addEventListener('click', clickHandler)
  }

  const unbindEvents = () => {
    window.removeEventListener('resize', monitorScreenWidth)
    document.body.removeEventListener('click', clickHandler)
  }

  const toggleCustomerMenu = () => {
    setAccountMenuOpen(!accountMenuOpen)
  }

  const getCustomerClassNames = () => {
    return accountMenuOpen
      ? `${ classes.headerIcon__customer } ${ classes.headerIcon__customerOpen }`
      : `${ classes.headerIcon__customer }`
  }

  const signOutAction = useCallback(() => {
    setAccountMenuOpen(false)
  }, [setAccountMenuOpen])

    const logoutAction = () => {
        setIsLoginModalVisible(false)
        signOutAction()
    }

  return (
    <div
      ref={ node }
      className={ classes.additionalActions }
    >
      <div className={ `${ classes.additionalActions__link } ${ classes.additionalActions__link_locations }` }>
        <StoreLocatorIconLink/>
      </div>
      <div className={ classes.additionalActions__link }>
        <div className={ 'desktop__l' }>
          <span
            className={ getCustomerClassNames() }
            onClick={ drawCustomerMenu }
          >
          <span>{ t({ s: 'My BMN' }) }</span>
        </span>
        </div>

        <div className={ 'mobile__l' }>
          {
            !isSignedIn
              ? <Link
                to={ '/login' }
                className={ getCustomerClassNames() }
              >
              </Link>
              : <a
                href={ '/customer/account' }
                className={ getCustomerClassNames() }
              >
              </a>
          }
        </div>
        {
          accountMenuOpen ? <CustomerAccount callback={ signOutAction } toggleLoginModal={toggleLoginModal} logoutAction={logoutAction} /> : ''
        }

      </div>
      <div className={ classes.additionalActions__link }>
        <Link
          to={ '/cart' }
          className={ classes.headerIcon__link }
        >
          <span className={ hasItems
            ? classes.headerIcon__cartLoaded
            : classes.headerIcon__cart }>
          </span>
          {
            hasItems
              ? <span className={ classes.additionalActions__cartQty }>{ itemCount }</span>
              : ''
          }
        </Link>
      </div>
        { isLoginModalVisible
            ? <SignInModal
                state={ isLoginModalVisible }
                onClose={ disableLoginModal }
            />
            : null
        }
    </div>
  )
}

export default Additional

Additional.propTypes = {
  classes: shape({
    additionalActions__link: string,
    additionalActions__link_locations: string,
    headerIcon__customer: string,
    headerIcon__customerOpen: string,
    headerIcon__link: string,
    headerIcon__cart: string,
    headerIcon__cartLoaded: string,
    additionalActions__cartQty: string
  })
}
