import React, { Fragment, useState, useMemo } from 'react'
import { func, shape, string } from 'prop-types'
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql'
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql'

import { Form } from 'informed'
import Field from '../Field'
import TextInput from '../TextInput'
import combine from '@magento/venia-ui/lib/util/combineValidators'
import { isRequired, validateEmail } from '../../utils/formValidators'

import classes from './signIn.less'
import Button, { BUTTON_TYPE_ACTION_EXTERNAL, BUTTON_TYPE_SUBMIT } from '../Button'
import Message, { MESSAGE_TYPE_ERROR } from '../Message'
import t from '@bmn/translate'
import LoadingMask from '../LoadingIndicator/loadingMask'
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage'
import { gql } from '@apollo/client'
import { useSignIn } from '../../talons/SignIn/useSignIn'
import {useUserContext} from "@magento/peregrine/lib/context/user";

export const GET_CUSTOMER = gql`
    query GetCustomerAfterSignIn {
      customer {
        id
        email
        firstname
        lastname
        segments {
          id
        }
        company_status
        freight_cost_applied
        requisition_lists {
          __typename
          items {
            uid
            name
            description
            items_count
          }
          total_count
        }
      }
    }
`


const SignIn = props => {
	const {
		setDefaultUsername,
		showCreateAccount,
		showForgotPassword,
		titleDescription,
		description,
		bottomDescription,
		afterSignIn,
		additionalClassName,
		submitButtonClass
	} = props

	const [isSubmitting, setIsSubmitting] = useState(false)

	const talonProps = useSignIn({
		customerQuery: GET_CUSTOMER_QUERY,
		getCartDetailsQuery: GET_CART_DETAILS_QUERY,
		setDefaultUsername,
		showCreateAccount,
		showForgotPassword,
		operations: {
			getCustomerQuery: GET_CUSTOMER
		}
	})

	const {
		errors,
		formRef,
		handleSubmit,
        formApiRef,
		setFormApi
	} = talonProps

	const errorMessage = deriveErrorMessage(Array.from(errors.values()))
    const [ { isSignedIn: isUserSignedIn} ] = useUserContext();
    const handleCustomSubmit = (event) => {
		const { current: formApi } = formApiRef
		setIsSubmitting(true)
		handleSubmit(event)
		formApi.reset()

		setIsSubmitting(false)
	}
    useMemo(() =>{
        if(isUserSignedIn)
        {
            afterSignIn()
        }
    }, [isUserSignedIn])

	const submitButtonClassName = submitButtonClass ? submitButtonClass : 'secondary'


	return (
		<Fragment>
			{
				isSubmitting
					? <LoadingMask/>
					: ''
			}
			{
				titleDescription
					? (<div
						className={ classes.signIn__titleDescription }
						dangerouslySetInnerHTML={ { __html: titleDescription } }
					/>)
					: ''
			}
			{
				description
					? (<div
						className={ classes.signIn__description }
						dangerouslySetInnerHTML={ { __html: description } }
					/>)
					: ''
			}
			<div className={ `${ classes.signIn__container } ${ classes[additionalClassName] }` }>
				{
					errorMessage.length > 0
						? <Message
							type={ MESSAGE_TYPE_ERROR }
							text={ t({ s: errorMessage }) }
						/>
						: ''
				}
				<Form
					ref={ formRef }
					getApi={ setFormApi }
					className={ classes.signIn__form }
					onSubmit={ (event) => handleCustomSubmit(event) }
				>
					<div className={ classes.signIn__wrapper }>
						<span>{ t({ s: 'E-mail' }) }</span>
						<Field
							required={ true }
							cssClass={ classes.signIn__field }
						>
							<TextInput
								autoComplete="email"
								field="email"
								type="text"
								autoFocus
								placeholder={ t({ s: 'E-mail...' }) }
								validate={ combine([isRequired, validateEmail]) }
							/>
						</Field>
					</div>
					<div className={ classes.signIn__wrapper }>
						<span>{ t({ s: 'Password' }) }</span>
						<Field
							required={ true }
							cssClass={ classes.signIn__field }
						>
							<TextInput
								autoComplete="current-password"
								field="password"
								type="password"
								placeholder={ t({ s: 'Password...' }) }
								validate={ isRequired }
							/>
						</Field>
					</div>
					<div className={ classes.signIn__button }>
						<Button
							type={ BUTTON_TYPE_SUBMIT }
							cssClass={ submitButtonClassName }
							text={ t({ s: 'Sign in' }) }
						/>
					</div>
				</Form>
				<div className={ classes.signIn__forgotPassword }>
					<Button
						type={ BUTTON_TYPE_ACTION_EXTERNAL }
						cssClass={ 'link' }
						text={ t({ s: 'Forgot password' }) }
						onClick={ () => {
							location.assign('/customer/account/forgotpassword')
						} }
					/>
				</div>
			</div>
			{
				bottomDescription
					? (<div
						className={ classes.signIn__bottomDescription }
						dangerouslySetInnerHTML={ { __html: bottomDescription } }
					/>)
					: ''
			}
		</Fragment>
	)
}

SignIn.propTypes = {
	classes: shape({
		buttonsContainer: string,
		form: string,
		forgotPasswordButton: string,
		forgotPasswordButtonContainer: string,
		root: string,
		title: string
	}),
	setDefaultUsername: func,
	showCreateAccount: func,
	showForgotPassword: func,
	afterSignIn: func.isRequired,
	titleDescription: string,
	description: string,
	bottomDescription: string,
	additionalClassName: string,
	submitButtonClass: string
}

SignIn.defaultProps = {
	setDefaultUsername: () => {
	},
	showCreateAccount: () => {
	},
	showForgotPassword: () => {
	}
}

export default SignIn
