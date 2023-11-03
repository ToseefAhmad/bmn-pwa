import React, { Component, Fragment } from 'react'
import { node, number, oneOfType, shape, string } from 'prop-types'
import { asField, BasicText } from 'informed'
import { compose } from 'redux'

import classify from '@magento/venia-ui/lib/classify'
import { Message } from '@magento/venia-ui/lib/components/Field'
import defaultClasses from './textInput.less'

/**
 * @todo: Next time this component is needed for a change, refactor it to a functional component.
 */
export class TextInput extends Component {
  static propTypes = {
    after: node,
    before: node,
    classes: shape({
      input: string
    }),
    fieldState: shape({
      value: oneOfType([ number, string ]),
    }),
    message: node
  }

  render() {
    const {
      classes,
      fieldState,
      message,
      ...rest
    } = this.props

    return (
      <Fragment>
        <BasicText
          { ...rest }
          fieldState={ fieldState }
          className={ classes.input }
        />
        <Message fieldState={ fieldState }>{ message }</Message>
      </Fragment>
    )
  }
}

export default compose(
  classify(defaultClasses),
  asField
)(TextInput)
