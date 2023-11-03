import React, { useCallback, useEffect, useState } from 'react'
import { func, shape, number, string, array } from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './requisition-list.less'

const RequisitionList = props => {
  const { onClick, requisitionList } = props
  const [itemCount, setItemCount] = useState(0)
  const classes = mergeClasses(defaultClasses, props.classes)

  const handleClick = useCallback(() => {
    onClick(requisitionList)
  }, [requisitionList, onClick])

  useEffect(() => {
    setItemCount(requisitionList.items_count)
  }, [requisitionList, requisitionList.items])

  return (
    <button className={classes.listItemButton} onClick={ handleClick }>
      <span>
        { requisitionList.name } { itemCount ? `(${ itemCount })` : '' }
      </span>
    </button>
  )
}

RequisitionList.propTypes = {
  onClick: func,
  requisitionList: shape({
    id: number,
    name: string,
    items: array
  })
}

export default RequisitionList
