/**
 * Retrieve result of matching string and process in object.
 *
 * @param url
 * @returns {{}}
 */
export function parseUrl (url) {
  let parsedUrl = {}

  if (url) {
    const pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?")
    const matches = url.match(pattern)

    parsedUrl = {
      scheme: matches[2],
      authority: matches[4],
      path: matches[5],
      query: matches[7],
      fragment: matches[9]
    }
  }

  return parsedUrl
}

/**
 * Get url path
 *
 * @param url
 * @returns {*}
 */
export function getUrlPath (url) {
  return parseUrl(url).path
}

/**
 * Remove base part of url
 *
 * @param url
 * @returns {string}
 */
export function removeBaseUrl (url) {
  return url ? url.replace(/^.*\/\/[^\/]+/, '') : ''
}

/**
 * Check if given URL should be internal
 *
 * @param url
 * @returns {boolean}
 */
export function isInternalUrl (url) {
  let isInternal = true

  const parsedUrl = parseUrl(url)
  const parsedBackendUrl = parseUrl(process.env.MAGENTO_BACKEND_URL)

  if (parsedUrl.authority && (parsedBackendUrl.authority !== parsedUrl.authority)) {
    isInternal = false
  }

  return isInternal
}

/**
 * Get full url path based on url_path parameter
 *
 * @param urlPath
 * @returns {string|boolean}
 */
export const getFullUrl = urlPath => {
  const backendUrl = process.env.MAGENTO_BACKEND_URL

  return urlPath
    ? backendUrl + urlPath
    : false
}
