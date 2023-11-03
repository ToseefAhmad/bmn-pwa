import React, { Fragment } from 'react'
import { shape, string } from 'prop-types'
import loginClasses from './login-page.css'
import Button, { BUTTON_TYPE_ACTION_EXTERNAL } from '../../../../../../src/components/Button'
import CmsBlock from '../../../../../../src/components/Cms/Block'
import SignIn from '../../../../../../src/components/Customer/signIn'
import t from '@bmn/translate'
import { useLoginPage } from '../../talons/LoginPage/useLoginPage'
import { useStyle } from '@magento/venia-ui/lib/classify'
import { useToasts } from '@magento/peregrine'

const LoginPage = props => {
	const [, { addToast }] = useToasts()
	const { data } = useLoginPage({})
	const classes = useStyle(loginClasses, props.classes)
	const content = <></>
	let contentLogin = <></>
	let contentAccount = <></>

	let contentCompany = <></>

	if (!data) {
		return content
	}

	const {
		customer_pwa_login_cms_block_login: identifierLogin,
		customer_pwa_login_cms_block_create_account: identifierAccount,
		customer_pwa_login_cms_block_create_company: identifierCompany
	} = data || {}

	if (identifierLogin) contentLogin = <CmsBlock blockId={ identifierLogin }/>
	if (identifierAccount) contentAccount = <CmsBlock blockId={ identifierAccount }/>
	if (identifierCompany) contentCompany = <CmsBlock blockId={ identifierCompany }/>

	const afterSignInOnPage = () => {
		addToast({
			type: 'success',
			message: t({ s: 'Logged in!' }),
			dismissable: true,
			timeout: 2000
		})
	}

	return (
		<Fragment>
			<div className={ classes.loginContainer }>
				<div className={ classes.customerLogin }>
					<div className={ classes.blockTitle }>
						<span>{ t({ s: 'Login' }) }</span>
					</div>
					<div>
						{ contentLogin }
					</div>
					<SignIn
						setDefaultUsername={ () => {
						} }
						showCreateAccount={ () => {
						} }
						showForgotPassword={ () => {
						} }
						afterSignIn={ afterSignInOnPage }
						additionalClassName={ 'loginPage' }
						submitButtonClass={ 'primary' }
					/>
					<div className={ classes.blockRequired }>
						<span>{ t({ s: '* Required Fields' }) }</span>
					</div>
				</div>
				<div className={ classes.newCustomerWrapper }>
					<div className={ classes.newCustomer }>
						<div className={ classes.blockTitle }>
							<span>{ t({ s: 'New Customers' }) }</span>
						</div>
						<div>
							{ contentAccount }
							<div className={ classes.signIn__button }>
								<Button
									type={ BUTTON_TYPE_ACTION_EXTERNAL }
									cssClass={ 'primary' }
									text={ t({ s: 'Create an Account' }) }
									onClick={ () => {
										location.assign('customer/account/create')
									} }
								/>
							</div>
						</div>
					</div>
					<div className={ classes.newCompany }>
						<div className={ classes.blockTitle }>
							<span>{ t({ s: 'New Company Account' }) }</span>
						</div>
						<div>
							{ contentCompany }
							<div className={ classes.signIn__button }>
								<Button
									type={ BUTTON_TYPE_ACTION_EXTERNAL }
									cssClass={ 'primary' }
									text={ t({ s: 'Create a Company Account' }) }
									onClick={ () => {
										location.assign('company/account/create')
									} }
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

LoginPage.propTypes = {
	classes: shape({
		loginContainer: string,
		customerLogin: string,
		newCustomerWrapper: string,
		newCustomer: string,
		newCompany: string,
		blockTitle: string,
		signIn__button: string,
		blockRequired: string
	})
}

export default LoginPage
