import React from 'react'
import { string } from 'prop-types'

import classes from './message.less'

export const MESSAGE_TYPE_SUCCESS = 'success'
export const MESSAGE_TYPE_NOTICE = 'notice'
export const MESSAGE_TYPE_ERROR = 'error'

const Message = props => {
  const {
    type,
    text
  } = props

  const getMessageClass = messageType => {
    return 'message__' + messageType
  }

  return <div className={ classes.message + ' ' + classes[getMessageClass(type)] }>
    <span>{ text }</span>
  </div>
}

Message.propTypes = {
  type: string.isRequired,
  text: string.isRequired
}

export default Message
