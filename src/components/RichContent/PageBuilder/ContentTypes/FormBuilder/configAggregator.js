import { searchNode } from '../../custom-utils'
import Field from '../../../../Field'
import React, { Fragment } from 'react'
import TextInput from '../../../../TextInput/textInput'
import { Select, Option, Radio, RadioGroup } from 'informed'
import TextArea from '../../../../TextArea'
import t from '@bmn/translate'
import formStyles from './form.less'

export default node => {
  const form = searchNode(node, 'form')
  const title = searchNode(form, 'h3')

  let buttonText = t({ s: 'Submit' })
  const button = searchNode(form, 'BUTTON')
  if (button) {
    buttonText = button.innerText
  }

  let webformId
  const webformIdField = form.querySelectorAll('[name="webform_id"]')
  if (webformIdField.length > 0) {
    webformId = webformIdField[0].value
  }

  const formFields = [...form.querySelectorAll('.field:not(.choice)')].map((el, index) => {
    const label = el.querySelector('label')
    const labelText = label.innerHTML
    const element = el.querySelectorAll('input, select, textarea')[0]
    const isRequired = element.getAttribute('aria-required') === 'true'
    const elementName = element.getAttribute('name')

    if (
      elementName !== 'form_key' &&
      elementName !== 'webform_id' &&
      elementName !== 'submitForm_1' &&
      element.nodeName !== 'BUTTON'
    ) {
      const comment = el.querySelector('.webforms-fields-comment') ? el.querySelector('.webforms-fields-comment') : null
      let elementComponent = <Fragment key={ index }>
        <Field
          required={ isRequired }
          label={ labelText }
        >
          <TextInput
            field={ element.name }
            type={ element.type }
            placeholder={ element.placeholder }
          />
          {
            comment
              ? <span
                className={ formStyles.fieldComment }
                dangerouslySetInnerHTML={ { __html: comment.innerHTML } }
              />
              : <Fragment/>
          }
        </Field>
      </Fragment>

      if (element.nodeName === 'SELECT') {
        const items = [
          <Option
            label={ t({ s: 'Select an option' }) }
            value={ '' }
            key={ -1 }
            disabled
          />
        ]
        for (const [key, option] of Object.entries(element.children)) {
          items.push(
            <Option
              key={ key }
              label={ option.value }
              value={ option.value }
            />
          )
        }
        elementComponent = <Fragment key={ index }>
          <div className={ formStyles.select }>
            <Field
              required={ isRequired }
              label={ labelText }
            >
              <Select
                field={ element.name }
              >
                { items }
              </Select>
            </Field>
            {
              comment
                ? <span
                  className={ formStyles.fieldComment }
                  dangerouslySetInnerHTML={ { __html: comment.innerHTML } }
                />
                : <Fragment/>
            }
          </div>
        </Fragment>
      }

      if (element.nodeName === 'TEXTAREA') {
        elementComponent = <Fragment key={ index }>
          <Field
            required={ isRequired }
            label={ labelText }
          >
            <TextArea field={ element.name }/>
            {
              comment
                ? <span
                  className={ formStyles.fieldComment }
                  dangerouslySetInnerHTML={ { __html: comment.innerHTML } }
                />
                : <Fragment/>
            }
          </Field>
        </Fragment>
      }

      if (element.getAttribute('type') === 'radio') {
        const radioOptions = [...el.querySelectorAll('input')].map(
          (radioElement, radioIndex) => {
            const radioName = radioElement.name.replace('[]', '')
            return (
              <div
                className={ formStyles.inputField }
                key={ radioIndex }
              >
                <Radio
                  value={ radioElement.value }
                  field={ radioName }
                  id={ radioElement.value + '_' + radioName }
                />
                <label
                  htmlFor={ radioElement.value + '_' + radioName }
                >
                  { radioElement.value }
                </label>
              </div>
            )
          }
        )

        elementComponent = <Fragment key={ index }>
          <Field
            required={ isRequired }
            label={ labelText }
            cssClass={ formStyles.group }
          >
            <RadioGroup
              field={ element.name }
            >
              { radioOptions }
            </RadioGroup>
          </Field>
          {
            comment
              ? <span
                className={ formStyles.fieldComment }
                dangerouslySetInnerHTML={ { __html: comment.innerHTML } }
              />
              : <Fragment/>
          }
        </Fragment>
      }

      if (element.getAttribute('type') === 'checkbox') {
        const checkboxOptions = [...el.querySelectorAll('input')].map(
          (checkboxElement, checkboxIndex) => {
            const checkboxName = checkboxElement.name.replace('[]', '')
            return (
              <div
                key={ checkboxIndex }
                className={ formStyles.inputField }
              >
                <label>
                  <input
                    type='checkbox'
                    name={ checkboxName }
                    required={ isRequired }
                    onChange={ () => { } }
                  />
                  { checkboxElement.value }
                </label>
              </div>
            )
          }
        )

        elementComponent = <Fragment key={ index }>
          <div
            className={ formStyles.group }
          >
            <label>
              { labelText }
            </label>
            { checkboxOptions }
          </div>
          {
            comment
              ? <span
                className={ formStyles.fieldComment }
                dangerouslySetInnerHTML={ { __html: comment.innerHTML } }
              />
              : <Fragment/>
          }
        </Fragment>
      }

      return elementComponent
    }
  })

  return {
    buttonText,
    formFields,
    title: title.innerHTML,
    webformId
  }
}
