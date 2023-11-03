/**
 * convert string to dangerously insert html object.
 * @param string
 * @returns {{__html}}
 */
export const toHTML = string => ({ __html: string })

/**
 * Get requested cookie by name
 *
 * @param cookieName
 * @returns {string|null}
 */
export const getCookie = (cookieName) => {
	const cookie = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)')

	return cookie ? cookie[2] : false
}

/**
 * Set cookie with lifetime in seconds.
 *
 * @param cookieName
 * @param cookieValue
 * @param cookieLifetime
 * @param cookiePath
 */
export const setCookie = (
	cookieName,
	cookieValue,
	cookieLifetime = 3600,
	cookiePath = '/'
) => {
	const date = new Date()
	date.setTime(date.getTime() + cookieLifetime * 1000)

	document.cookie = cookieName + '=' + cookieValue + ';path=' + cookiePath + ';expires=' + date.toUTCString()
}

/**
 * Delete cookie
 *
 * @param cookieName
 */
export const deleteCookie = (cookieName) => {
	setCookie(cookieName, '', 0)
}
