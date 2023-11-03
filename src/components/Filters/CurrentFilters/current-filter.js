import React, { useCallback } from 'react'
import { func, shape, string } from 'prop-types'
import { X as Remove } from 'react-feather'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import Icon from '@magento/venia-ui/lib/components/Icon'
import Trigger from '@magento/venia-ui/lib/components/Trigger'
import defaultClasses from './current-filter.less'

const CurrentFilter = props => {
  const {group, groupName, handleApply, item, removeItem} = props
  const text = item.title
  const classes = mergeClasses(defaultClasses, props.classes)

  const handleClick = useCallback(() => {
    removeItem({group, item})
    handleApply()
  }, [group, item, removeItem, handleApply])

  return (
    <span className={ classes.wrapper }>
      <span className={ classes.text }>
        { `${ groupName }: ${ text }` }
      </span>
      <span className={ classes.icon }>
        <Trigger action={ handleClick }>
          <Icon
            size={ 12 }
            src={ Remove }
          />
        </Trigger>
      </span>
    </span>
  )
}

export default CurrentFilter

CurrentFilter.propTypes = {
  classes: shape({
    wrapper: string,
    text: string
  }),
  handleApply: func,
  removeItem: func
}
