import React from 'react'
import * as locales from './locales/index'
import { string } from 'prop-types'

const t = props => {
  const locale = 'nl'
  const { s, r } = props
  let translatedString = locales[locale].hasOwnProperty(s) ? locales[locale][s] : s

  if (r && r.length > 0) {
    for (let i = 0; i <= r.length; i++) {
      translatedString = translatedString.replace('%' + (i + 1), r[i])
    }
  }

  return translatedString
}

t.propTypes = { s: string }
t.defaultProps = { s: '' }

export default t
