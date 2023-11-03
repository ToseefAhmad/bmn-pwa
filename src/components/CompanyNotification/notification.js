import React from 'react'
import { string } from 'prop-types'
import classes from './notification.less'
import t from '@bmn/translate'

const HeaderNotification = props => {
  const { status } = props

  const getNotificationClass = status => {
    return 'notification__' + status
  }

  const getMessageByType = status => {
    const statusTranslation = t({s: status});
    return t({ s: 'Your company account is %1 and you cannot place an order. Contact your local store', r: [statusTranslation] })
  }

  return (
    <div className={ classes.notification + ' ' + classes[getNotificationClass(status)]}>
      { getMessageByType(status) }
    </div>
  )
}
HeaderNotification.propTypes = {
  status: string.isRequired
}

export default HeaderNotification