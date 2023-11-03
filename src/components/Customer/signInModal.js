import React from 'react'
import PropTypes from 'prop-types'
import SignIn from './signIn'
import ThemeModal from '../Modal/ThemeModal'
import GET_SIGN_IN_MODAL_DATA from '../../queries/getSignInModalData.graphql'
import { useQuery } from '@apollo/client'
import Portal from '@magento/venia-ui/lib/components/Portal/portal'

const SignInModal = props => {
  const { onClose } = props
  const { data, loading, error } = useQuery(GET_SIGN_IN_MODAL_DATA)

  if (loading || error || !data) {
    return (<></>)
  }

  const modalTitle = data.storeConfig.theme_login_modal_title
  const modalTitleDescription = data.storeConfig.theme_login_modal_description_title
  const modalDescription = data.storeConfig.theme_login_modal_description
  const modalBottomDescription = data.storeConfig.theme_login_modal_bottom_description

  return (
    <Portal>
      <ThemeModal
        title={ modalTitle }
        content={ <SignIn
          setDefaultUsername={ () => {} }
          showCreateAccount={ () => {} }
          showForgotPassword={ () => {} }
          afterSignIn={ onClose }
          titleDescription={ modalTitleDescription }
          description={ modalDescription }
          bottomDescription={ modalBottomDescription }
        /> }
        callback={ onClose }
        hideFooter={ true }
      />
    </Portal>
  )
}

SignInModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default SignInModal
