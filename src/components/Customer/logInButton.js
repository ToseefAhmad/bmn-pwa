import React, { Fragment, useState } from 'react'
import Button, { BUTTON_TYPE_ACTION_EXTERNAL, BUTTON_TYPE_NO_ACTION } from '../Button'
import SignInModal from './signInModal'
import classes from './signIn.less'
import t from '@bmn/translate'
import { isNativeApp } from '../../utils/recogniseNativeApp'
import { EXACT_URL_LOGIN } from '../Routes/routes'

const LogInButton = () => {
  const [modalVisible, setModalVisibility] = useState(false)

  const onClick = () => {
    setModalVisibility(true)
  }

  const onModalClose = () => {
    setModalVisibility(false)
  }

  return (
    <Fragment>
      {
        !isNativeApp()
          ? <Fragment>
            <Button
              type={ BUTTON_TYPE_NO_ACTION }
              cssClass={ 'primary-signIn' }
              onClick={ onClick }
            >
              <span className={ classes.button__notLoggedIn }>{ t({ s: 'Sign in' }) }</span>
            </Button>
            {
              modalVisible
                ? <SignInModal
                  state={ modalVisible }
                  onClose={ onModalClose }
                />
                : ''
            }
          </Fragment>
          : <Fragment>
            <Button
              type={ BUTTON_TYPE_ACTION_EXTERNAL }
              cssClass={ 'primary-signIn' }
              url={ EXACT_URL_LOGIN }
            >
              <span className={ classes.button__notLoggedIn }>{ t({ s: 'Sign in' }) }</span>
            </Button>
          </Fragment>
      }
    </Fragment>
  )
}

export default LogInButton
