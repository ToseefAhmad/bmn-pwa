import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { gql, useApolloClient, useMutation } from '@apollo/client'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { useMyAccount } from '@magento/peregrine/lib/talons/MyAccount/useMyAccount'
import t from '@bmn/translate'
import { getCookie, setCookie } from '../Cookie/cookieManager'
import {
  combinedSessionCookie,
  externalLogoutCookie,
} from '../../talons/SharedSession/useSharedSession'
import { EXACT_URL_LOGIN } from '../Routes/routes'

export const SIGN_OUT = gql`
    mutation SignOut {
        revokeCustomerToken {
            result
        }
    }
`
// A mix of the core useAuthModel and myAccount component, purely for signOut purposes
const SignOut = props => {
  const {
    asListItem,
    wrapperClass,
    spanClass,
    onSignOutCallback
  } = props

  const { resetStore } = useApolloClient()
  const [, { signOut }] = useUserContext()
  const [revokeToken] = useMutation(SIGN_OUT)
  const history = useHistory()

  const handleSharedSessionLogout = async () => {
    if (!getCookie(externalLogoutCookie)) {
      await setCookie(externalLogoutCookie, true)
      await setCookie(combinedSessionCookie, true)
    }
  }

  const onSignOut = useCallback(async () => {
    await handleSharedSessionLogout()
    await resetStore()
    await signOut({ revokeToken })

    history.push(EXACT_URL_LOGIN)

  }, [history, resetStore, revokeToken, signOut])

  const talonProps = useMyAccount({
    onSignOut: onSignOut
  })

  const { handleSignOut } = talonProps
  const innerSpan = <span className={ spanClass }>{ t({ s: 'Log out' }) }</span>

  const beforeSignOut = () => {
    onSignOutCallback()
    handleSignOut()
  }

  return asListItem
    ? <li
      className={ wrapperClass }
      onClick={ beforeSignOut }
    >
      { innerSpan }
    </li>
    : <div className={ wrapperClass }> { innerSpan } </div>
}

SignOut.propTypes = {
  asListItem: PropTypes.bool,
  wrapperClass: PropTypes.string,
  spanClass: PropTypes.string
}

export default SignOut
