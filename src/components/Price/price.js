import React, { PureComponent, Fragment } from 'react'
import { number, string, shape } from 'prop-types'
import patches from '@magento/peregrine/lib/util/intlPatches'

/**
 * The **Price** component is used anywhere a price needs to be displayed.
 *
 * Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers.
 *
 * A [polyfill][] is required for any JavaScript runtime that does not have [Intl.NumberFormat.prototype.formatToParts][].
 *
 * [polyfill]: https://www.npmjs.com/package/intl
 * [Intl.NumberFormat.prototype.formatToParts]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
 */
export default class Price extends PureComponent {
  static propTypes = {
    /**
     * The numeric price
     */
    value: number.isRequired,
    /**
     * A string with any of the currency code supported by Intl.NumberFormat
     */
    currencyCode: string.isRequired,
    locale: string,
    /**
     * Class names to use when styling this component
     */
    classes: shape({
      currency: string,
      integer: string,
      decimal: string,
      fraction: string
    })
  }

  /**
   * Added 'locale' as a prop and nl-NL as default; this changes the decimal dot to a decimal comma.
   * Using nl-NL instead of (e.g.) en-US also adds an additional
   *  <span>&nbsp;</span> between the currencySymbol and price.
   *
   * Example:
   *    undefined: 123,000.000
   *    nl-NL: 123.000,000
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  static defaultProps = {
    locale: 'nl-NL',
    classes: {}
  }

  render () {
    const {
      value,
      currencyCode,
      locale,
      classes
    } = this.props

    const parts = patches.toParts.call(
      Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
      }),
      value
    )

    const children = parts.map((part, i) => {
      const partClass = classes[part.type]
      const key = `${ i }-${ part.value }`

      return (
        <span key={ key } className={ partClass }>{ part.value }</span>
      )
    })

    return <Fragment>{ children }</Fragment>
  }
}
