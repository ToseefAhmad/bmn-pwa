import React, { Fragment, useState } from 'react'
import defaultClasses from './form-builder.less'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { Form } from 'informed'

import Button, { BUTTON_TYPE_SUBMIT } from '../../../../Button'
import { toHTML } from '../../custom-utils'
import { useMutation } from '@apollo/client'
import SAVE_WEBFORM_MUTATION from '../../../../../queries/saveWebForm.graphql'
import t from '@bmn/translate'
import { array, shape, string } from 'prop-types'
import { useToasts } from '@magento/peregrine'

const FormBuilder = props => {
  const [saveWebForm] = useMutation(SAVE_WEBFORM_MUTATION, { fetchPolicy: 'no-cache' })
  const [message, setMessage] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [, { addToast }] = useToasts()

  const {
    buttonText,
    formFields,
    title,
    webformId
  } = props

  const classes = mergeClasses(defaultClasses, props.classes)

  const resetForm = () => {
    setDisabled(false)
    setMessage(null)
  }

  const submitForm = values => {
    setDisabled(true)

    if (values.field && values.field.length) {
      const variables = { input: {} }
      variables.input.id = webformId
      variables.input.fields = []
      if (values.field && values.field.length) {
        values.field.forEach((value, id) => {
          const fieldData = {
            id: id.toString(),
            value
          }
          variables.input.fields.push(fieldData)
        })
      }

      saveWebForm({ variables }).then(
        data => {
          if (data.data.saveWebform.message) {
            setMessage(data.data.saveWebform.message)
          } else {
            setMessage(t({ s: 'Thanks for your inquiry.' }))
          }
        }
      )
    } else {
      addToast({
        type: 'error',
        message: t({ s: 'Fill in the fields to sent the form' }),
        dismissable: true,
        timeout: 5000
      })
      setDisabled(false)
    }
  }

  return (
    <div>
      <h2 dangerouslySetInnerHTML={ toHTML(title) }>
      </h2>
      {
        message
          ? <Fragment>
            <div className={ classes.message__container }>
              <div className={ classes.success }>
                { message }
              </div>
              <div className={ classes.reset }>
                <span onClick={ resetForm }>
                  { t({ s: 'Do you have another question or inquiry? You can click here to fill in another form.' }) }
                </span>
              </div>
            </div>
          </Fragment>
          : <Fragment>
            <div className={ classes.form__container }>
              <Form onSubmit={ submitForm }>
                { formFields }
                <Button
                  key={ formFields.length + 1 }
                  cssClass={ 'primary' }
                  type={ BUTTON_TYPE_SUBMIT }
                  priority="high"
                  disabled={ disabled }
                  text={
                    disabled
                      ? t({ s: 'Sending..' })
                      : buttonText
                  }
                >
                </Button>
              </Form>
            </div>
          </Fragment>
      }
    </div>
  )
}

FormBuilder.propTypes = {
  buttonText: string,
  classes: shape({
    form__container: string,
    message__container: string,
    reset: string,
    succes: string
  }),
  formFields: array,
  title: string,
  webformId: string
}

export default FormBuilder
