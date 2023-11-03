import React, { useEffect, useState } from 'react'
import classNames from '../customerAccount.less'
import { Link } from 'react-router-dom'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { useCartContext } from '@magento/peregrine/lib/context/cart'

const AccountChip = props => {
	const [accountChip, setAccountChip] = useState(null)
	const [{ currentUser, isSignedIn }] = useUserContext()
	const [{ cartId }] = useCartContext()

	useEffect(() => {
		let loggedIn = true
		if (currentUser && isSignedIn && cartId) {
			setAccountChip((
				<li className={ classNames.customerAccountMenu__item + ' ' + classNames.customerAccountMenu__userItem }>
					<Link
						className={ classNames.customerAccountMenu__link }
						to={ '/customer/account' }
					>
          <span
	          className={ classNames.customerAccountMenu__contentTitle }
          >
            { currentUser.firstname } { currentUser.lastname }
          </span>
						<span className={ classNames.customerAccountMenu__contentSubtitle }>{ currentUser.email }</span>
					</Link>
				</li>))
		}

		return () => {
			loggedIn = false
		}
	}, [currentUser])

	return (
		accountChip
	)

}

export default AccountChip