import './window.less'

export const SCROLL_LOCK_ATTRIBUTE = 'scroll-lock'
export const OFFSET_ATTRIBUTE = 'offset'

export const DESKTOP_HEADER_HEIGHT = 150

export const DESKTOP_DIFFERENCE = 0

export function hasLock () {
  return document.body.hasAttribute(SCROLL_LOCK_ATTRIBUTE)
    && parseInt(document.body.getAttribute(SCROLL_LOCK_ATTRIBUTE)) === 1
}

export function getOffset () {
  const offset = document.body.getAttribute(OFFSET_ATTRIBUTE)
  return offset ? parseFloat(offset) : 0;
}

export function setLock () {
  document.body.setAttribute(SCROLL_LOCK_ATTRIBUTE, '1')
  document.documentElement.setAttribute(SCROLL_LOCK_ATTRIBUTE, '1')
}

export function removeLock () {
  document.body.removeAttribute(SCROLL_LOCK_ATTRIBUTE)
  document.documentElement.removeAttribute(SCROLL_LOCK_ATTRIBUTE)
}

export function hasOffset () {
  return document.body.hasAttribute(OFFSET_ATTRIBUTE)
}

export function hasLockOrOffset() {
  return hasLock() || hasOffset()
}

export function setOffset (offset) {
  document.body.setAttribute(OFFSET_ATTRIBUTE, offset)
}

export function removeOffset () {
  document.body.removeAttribute(OFFSET_ATTRIBUTE)
}

export function getPageOffset () {
  return window.pageYOffset
}

export function removeLockAndOffset () {
  removeLock()
  removeOffset()
}

export function isDesktop () {
  return window.matchMedia('(min-width: 1024px)').matches
}
