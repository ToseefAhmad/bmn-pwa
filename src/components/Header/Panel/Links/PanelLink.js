import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { func, shape, string, boolean } from 'prop-types'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import SignOut from '../../../Customer/signOut'

export const PanelLink = props => {
  const {
    link,
    onClick = () => {}
  } = props

  const [ isLoading, setIsLoading ] = useState(false)
  const [{ isSignedIn }] = useUserContext()
  const toggleIsLoading = () => {
    setIsLoading(!isLoading)
  }

  const {
    identifier,
    title,
    is_external,
    is_logout,
    show_logged_in,
    show_logged_out
  } = link

  if (
    (!show_logged_in && !show_logged_out) ||
    (isSignedIn && !show_logged_in) ||
    (!isSignedIn && !show_logged_out)
  ) {
    return null;
  }

  if (is_logout && isSignedIn) {
    return <SignOut
      asListItem={ true }
      onSignOutCallback={ toggleIsLoading }
    />
  }

  const LinkBody = is_external
    ? <a
      href={ identifier }
    >
      <span>{ title }</span>
    </a>
    : <Link
      to={ identifier }
      onClick={ onClick }
    >
      <span>{ title }</span>
    </Link>

  return <li>
    { LinkBody }
  </li>
}

PanelLink.propTypes = {
  link: shape({
    identifier: string.isRequired,
    title: string.isRequired,
    is_external: boolean,
    is_logout: boolean,
    show_logged_in: boolean,
    show_logged_out: boolean
  }).isRequired,
  onClick: func,
}

export default PanelLink
