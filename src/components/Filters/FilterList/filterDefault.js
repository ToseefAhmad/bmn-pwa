import React from 'react'
import { bool, shape, string } from 'prop-types'
import Checkbox from '../../Checkbox'

const FilterDefault = props => {
  const {
    item,
    isSelected,
    onClick,
    title
  } = props

  return (
    <Checkbox
      name={ `${ item.label}-${ item.value_index }` }
      label={ title }
      onClick={ onClick }
      isChecked={ isSelected }
    />
  )
}

export default FilterDefault

FilterDefault.propTypes = {
  classes: shape({
    root: string,
    icon: string,
    label: string,
    checked: string
  }),
  group: string,
  isSelected: bool,
  item: shape({
    label: string.isRequired,
    value_index: string.isRequired
  }).isRequired,
  label: string
}
