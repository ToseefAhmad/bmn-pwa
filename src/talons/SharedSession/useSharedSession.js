import { useCallback, useEffect } from 'react'

import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql'
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn'
import { deleteCookie, getCookie, setCookie } from '../../components/Cookie/cookieManager'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { SIGN_OUT } from '../../components/Customer/signOut'
import { useMutation } from '@apollo/client'
import { BrowserPersistence } from '@magento/peregrine/lib/util'

export const combinedSessionCookie = 'combined_session'
export const externalCustomerCookie = 'external_customer'
export const externalLogoutCookie = 'external_customer_logout'
export const logoutCookieValue = '1'
export const isLoggedOutCookieValue = '2'

/**
 * Custom hook/talon to log a customer in based on a cookie value
 * @returns {{createSharedSession: ((function(): Promise<void>)|*), deleteSharedSession: ((function(): Promise<void>)|*)}}
 */
export const useSharedSession = () => {
  const signInTalon = useSignIn({
    getCartDetailsQuery: GET_CART_DETAILS_QUERY
  })
  const storage = new BrowserPersistence();

  const {
    handleSubmit
  } = signInTalon

  const [, { signOut }] = useUserContext()
  const [revokeToken] = useMutation(SIGN_OUT)

  useEffect(() => {
    const token = storage.getItem('signin_token')
    if (token) {
      setCookie('sign_in_cookie', token)
    }
  }, [storage])

  const createSharedSession = useCallback(
    async () => {
      //Start external customer logic
      if (getCookie(externalCustomerCookie) && !getCookie(combinedSessionCookie)) {
        try {
          // eyJlbWFpbCI6Implcm9lbi5zY2hpcHBlckBndWFwYS5ubCIsInBhc3N3b3JkIjoiR3VhcGExMjMifQ==
          // Parse the value of the base64 cookie value
          // Parsed value should look like:
          // { email: 'example@example.com', password: 'password123' }
          const externalCustomer = JSON.parse(atob(decodeURIComponent(getCookie(externalCustomerCookie))))
          if (externalCustomer
            && externalCustomer.hasOwnProperty('email')
            && externalCustomer.hasOwnProperty('password')
          ) {
            // Delete the cookie for executing this logic only once.
            await deleteCookie(externalCustomerCookie)
            // Execute original login logic
            await handleSubmit({
              email: externalCustomer.email,
              password: externalCustomer.password
            })
            // Set a cookie to make the Magento2 front-end see that there is a customer logged_in
            await setCookie(combinedSessionCookie, true)
          }
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.error(e)
          }
        }
      }
    }, [handleSubmit]
  )

  const deleteSharedSession = useCallback(async () => {
    if (getCookie(externalLogoutCookie) === logoutCookieValue) {
      await setCookie(externalLogoutCookie, isLoggedOutCookieValue)
      await deleteCookie(combinedSessionCookie)
      await signOut({ revokeToken })
      await localStorage.clear()
    }
  }, [
    signOut,
    revokeToken
  ])

  return {
    createSharedSession,
    deleteSharedSession,
  }
}
