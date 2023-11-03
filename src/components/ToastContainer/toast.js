import { mergeClasses } from '@magento/venia-ui/lib/classify'
import Icon from '@magento/venia-ui/lib/components/Icon'
import { bool, func, number, object, oneOf, string } from 'prop-types'
import React from 'react'

import { AlertTriangle as WarningIcon, Check as SuccessIcon, Info as InfoIcon, X as CloseIcon } from 'react-feather'
import defaultClasses from './toast.less'

const Toast = props => {
  const {
    actionText,
    dismissable,
    icon,
    message,
    onAction,
    handleAction,
    onDismiss,
    handleDismiss,
    type,
  } = props

  const classes = mergeClasses(defaultClasses, {})

  let iconElement = icon ? <>{ icon }</> : null

  if (iconElement === null) {
    if (type === 'warning') {
      iconElement = <WarningIcon />
    }
    if (type === 'info') {
      iconElement = <InfoIcon />
    }
    if (type === 'error') {
      iconElement = <CloseIcon />
    }
    if (type === 'success') {
      iconElement = <SuccessIcon />
    }
  }

  const controls =
    onDismiss || dismissable ? (
      <button
        className={ classes.dismissButton }
        onClick={ handleDismiss }
      >
        <CloseIcon />
      </button>
    ) : null

  const actions = onAction ? (
    <div className={ classes.actions }>
      <button
        className={ classes.actionButton }
        onClick={ handleAction }
      >
        { actionText }
      </button>
    </div>
  ) : null

  return (
    <div className={ classes[`${ type }Toast`] }>
      <span className={ classes.icon }>{ iconElement }</span>
      <div className={ classes.message }>{ message }</div>
      <div className={ classes.controls }>{ controls }</div>
      { actions }
    </div>
  )
}

Toast.propTypes = {
  actionText: string,
  dismissable: bool,
  icon: object,
  id: number,
  message: string.isRequired,
  onAction: func,
  onDismiss: func,
  handleAction: func,
  handleDismiss: func,
  type: oneOf(['info', 'warning', 'error', 'success']).isRequired,
}

export default Toast
