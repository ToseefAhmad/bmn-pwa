import React, { Fragment } from 'react'
import defaultClasses from './cookie-notice.css'
import Mask from '@magento/venia-ui/lib/components/Mask'
import { Link } from 'react-router-dom'
import resourceUrl from '@magento/peregrine/lib/util/makeUrl'
import t from '@bmn/translate'
import Button from '../../../../../../src/components/Button'
import { useCookieNotice } from '../../talons/CookieNotice/useCookieNotice'
import { toHTML } from '../../util/cookie-manager'

const CookieNotice = props => {
	const cookieConfig = useCookieNotice()
	const {
		data,
		setAllowCookiesCookie,
		isActive
	} = cookieConfig

	return (
		<Fragment>
		{
			isActive
				? <Fragment>
					<div className={ defaultClasses.cookieNoticeMask }>
						<Mask isActive={ true }/>
					</div>
					<div className={ defaultClasses.cookieNotice }>
						{
							data.text
								? <p dangerouslySetInnerHTML={ toHTML(data.text) }/>
								: <></>
						}
						{
							data.pageId
								? <Link to={ resourceUrl(data.pageId) }>
									{
										data.linkText
											? data.linkText
											: t({ s: 'View privacy policy' })
									}
								</Link>
								: <></>
						}
						<Button
							text={ data.buttonText ? data.buttonText : t({ s: 'Allow cookies' }) }
							cssClass={ 'primary' }
							onClick={ () => {
								setAllowCookiesCookie()
							} }
						/>
					</div>
				</Fragment>
			: null
		}
		</Fragment>
	)
}

export default CookieNotice