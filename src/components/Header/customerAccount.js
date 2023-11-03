import React, { Fragment, useState } from 'react'
import classNames from './customerAccount.less'
import { func } from 'prop-types'
import AccountChip from './AccountChip'
import CustomerLinks from './CustomerLinks'
import LoginButton from './CustomerLinks/LoginButton/login-button'

// TODO: This component seems to be rendered twice on open (?)

const CustomerAccount = props => {
	const { callback, logoutAction, toggleLoginModal } = props

    return (
		<Fragment>
			<ul className={ classNames.customerAccountMenu } onMouseLeave={()=> callback()}>
				<AccountChip/>
                <CustomerLinks/>
				<LoginButton
					logoutAction={ logoutAction }
					toggleLoginModal={ () => toggleLoginModal() }
				/>
			</ul>
		</Fragment>
	)
}

CustomerAccount.propTypes = {
	callback: func
}

export default CustomerAccount
