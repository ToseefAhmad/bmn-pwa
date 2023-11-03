import { deleteCookie, getCookie, setCookie } from '../components/Cookie/cookieManager'

/**  Name to identify if the bmn app is visiting the page **/
export const NATIVE_APP_NAME = 'bmn_app'

/**
 * Set a cookie to identify if the page should dismiss
 * some components like header/footer/breadcrumbs/product title
 */
export const setNativeApp = (userAgent) => {
  let cookieValue = '0'
  if (userAgent === NATIVE_APP_NAME) {
    cookieValue = '1'
    document.body.setAttribute(NATIVE_APP_NAME, '1')
  }

  setCookie(NATIVE_APP_NAME, cookieValue)
}

/**
 * Check if the cookie value is set for the Native app.
 * @returns {boolean}
 */
export const isNativeApp = () => {
  return getCookie(NATIVE_APP_NAME) === '1'
}

/**
 * Removes the cookie and body attribute to make thing work like normal again.
 */
export const resetNativeApp = () => {
  document.body.removeAttribute(NATIVE_APP_NAME)
  deleteCookie(NATIVE_APP_NAME)
}