import React, { Fragment } from 'react'
import SignOut from '../../../Customer/signOut'
import classNames from '../../customerAccount.less'
import t from '@bmn/translate'
import { useUserContext } from '@magento/peregrine/lib/context/user'

const LoginButton = props => {
	const {
		logoutAction,
		toggleLoginModal
	} = props
	const [{ isSignedIn }] = useUserContext()

	return (
		<Fragment>
			{ isSignedIn ? <SignOut
				asListItem={ true }
				wrapperClass={ classNames.customerAccountMenu__item }
				spanClass={ classNames.customerAccountMenu__login }
				onSignOutCallback={ logoutAction }
			/> : <Fragment>
				<li
					className={ classNames.customerAccountMenu__item }
					onClick={ toggleLoginModal }
				>
					<span className={ classNames.customerAccountMenu__login }>{ t({ s: 'Sign in' }) }</span>
				</li>
			</Fragment> }
		</Fragment>
	)
}

export default LoginButton