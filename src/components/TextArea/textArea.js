import React, { Component, Fragment } from 'react'
import { asField, BasicTextArea } from 'informed'
import { node, number, oneOf, oneOfType, shape, string } from 'prop-types'
import { compose } from 'redux'

import classify from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './textArea.less'

/**
 * @todo: Next time this component is needed for a change, refactor it to a functional component.
 */
export class TextArea extends Component {
  static propTypes = {
    classes: shape({
      input: string,
    }),
    cols: oneOfType([number, string]),
    field: string.isRequired,
    fieldState: shape({
      value: string,
    }),
    message: node,
    rows: oneOfType([number, string]),
    wrap: oneOf(['hard', 'soft']),
  }

  static defaultProps = {
    cols: 40,
    rows: 4,
    wrap: 'hard',
  }

  render () {
    const { classes, fieldState, message, ...rest } = this.props

    return (
      <Fragment>
        <BasicTextArea
          { ...rest } fieldState={ fieldState }
          className={ classes.input }
        />
        <Message fieldState={ fieldState }>{ message }</Message>
      </Fragment>
    )
  }
}

export default compose(
  classify(defaultClasses),
  asField,
)(TextArea)
