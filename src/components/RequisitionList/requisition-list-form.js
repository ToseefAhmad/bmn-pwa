import React, { useCallback } from 'react'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import { Form } from 'informed'
import { arrayOf, bool, func, number, shape, string } from 'prop-types'

import { isRequired } from '../../utils/formValidators'
import Button, { BUTTON_TYPE_ACTION_EXTERNAL, BUTTON_TYPE_SUBMIT } from '../Button'
import Field from '../Field'
import TextArea from '../TextArea'
import TextInput from '../TextInput'
import defaultClasses from './requisition-list.less'
import t from '@bmn/translate'

const RequisitionListForm = props => {
  const {
    errors,
    onCancel: handleCancel,
    onSubmit: handleSubmit,
    initialValues,
    isDisabled,
    additionalActions
  } = props

  const errorMessage = errors.length
    ? errors
      .map(({ message }) => message)
      .reduce((acc, msg) => msg + '\n' + acc, '')
    : null

  const classes = mergeClasses(defaultClasses, props.classes)

  const onSubmit = useCallback(
    formValues => {
      formValues.items = initialValues.items
      handleSubmit(formValues, additionalActions)
    }, [initialValues])

  return (
    <Form
      className={classes.root}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Field
        label={t({ s : 'Requisition list name' })}
        cssClass={classes.field}
        required={true}
      >
        <div className={classes.control}>
          <TextInput
            field="name"
            autoComplete="list-name"
            validate={isRequired}
            validateOnBlur
            type="text"
          />
        </div>
      </Field>
      <Field label={t({ s : 'Description' })} cssClass={classes.field}>
        <div className={classes.control}>
          <TextArea
            field="description"
            autoComplete="description"
            maxLength="255"
            validateOnBlur
          />
        </div>
      </Field>
      <div className={classes.error}>{errorMessage}</div>
      <div className={classes.actions}>
        <Button
          className={'__primary--modal'}
          cssClass={ 'primary' }
          disabled={isDisabled}
          type={ BUTTON_TYPE_SUBMIT }
          priority="high"
        >
          {t({ s : 'Save' })}
        </Button>
        <Button
          className={'__tertiary-modal'}
          cssClass={ 'tertiary' }
          onClick={ handleCancel }
          type={ BUTTON_TYPE_ACTION_EXTERNAL }
          priority="high"
        >
          {t({ s : 'Cancel' })}
        </Button>
      </div>
    </Form>
  )
}

RequisitionListForm.propTypes = {
  classes: shape({
    actions: string,
    control: string,
    error: string,
    field: string,
    hidden: string,
    lead: string,
    root: string,
    subscribe: string,
  }),
  errors: arrayOf(string),
  initialValues: shape({
    id: number,
    name: string,
    description: string,
    items:  arrayOf(
      shape({
        id: number,
        requisition_list_id: number,
        sku: string,
        qty: number,
      }),
    ),
  }),
  isDisabled: bool,
  onSubmit: func.isRequired
}

RequisitionListForm.defaultProps = {
  errors: [],
  isDisabled: false,
}

export default RequisitionListForm
