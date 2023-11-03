/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `undefined` when they pass.
 */

import t from '@bmn/translate'

const SUCCESS = undefined

export const hasLengthAtLeast = (value, values, minimumLength) => {
  if (!value || value.length < minimumLength) {
    return t({ s: 'Must contain at least %1 character(s).', r: [minimumLength] })
  }

  return SUCCESS
}

export const hasLengthAtMost = (value, values, maximumLength) => {
  if (value && value.length > maximumLength) {
    return t({ s: 'Must not exceed %1 character(s).', r: [maximumLength] })
  }

  return SUCCESS
}

export const hasLengthExactly = (value, values, length) => {
  if (value && value.length !== length) {
    return t({ s: 'Must contain exactly %1 character(s).', r: [length] })
  }

  return SUCCESS
}

export const isRequired = value => {
  return (value || '').trim() ? SUCCESS : { id: t({ s: 'The field is required.' }) }
}

export const validateRegionCode = (value, values, countries) => {
  const country = countries.find(({ id }) => id === 'US')

  if (!country) {
    return t({ s: 'Country "US" is not an available country.' })
  }
  const { available_regions: regions } = country

  if (!(Array.isArray(regions) && regions.length)) {
    return t({ s: 'Country "US" does not contain any available regions.' })
  }

  const region = regions.find(({ code }) => code === value)
  if (!region) {
    return t({ s: 'State "%1" is not an valid state abbreviation.', r: [value] })
  }

  return SUCCESS
}

export const validatePassword = value => {
  const count = {
    lower: 0,
    upper: 0,
    digit: 0,
    special: 0
  }

  for (const char of value) {
    if (/[a-z]/.test(char)) count.lower++
    else if (/[A-Z]/.test(char)) count.upper++
    else if (/\d/.test(char)) count.digit++
    else if (/\S/.test(char)) count.special++
  }

  if (Object.values(count).filter(Boolean).length < 3) {
    return t({ s: 'A password must contain at least 3 of the following: lowercase, uppercase, digits, special' +
        ' characters.' })
  }

  return SUCCESS
}

export const validateConfirmPassword = (
  value,
  values,
  passwordKey = 'password'
) => {
  return value === values[passwordKey] ? SUCCESS : t({ s: 'Passwords must match.' })
}

export const validateEmail = value => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return regex.test(value)
    ? SUCCESS
    : { id: t({ s: 'Please enter a valid email address (Ex: johndoe@domain.com).' }) }
}
