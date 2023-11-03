import React from 'react'
import classes from './pageLayout.less'

export const PAGE_1_COLUMN = '1column'
export const PAGE_2_COLUMNS_LEFT = '2columns-left'
export const PAGE_2_COLUMNS_RIGHT = '2columns-right'

export function getLayoutWrapperClass(pageLayout) {
  const validLayouts = [PAGE_2_COLUMNS_LEFT, PAGE_2_COLUMNS_RIGHT]

  return validLayouts.indexOf(pageLayout) > -1
    ? classes['page-' + pageLayout]
    : classes['page-' + PAGE_1_COLUMN]
}

const Sidebar = props => {
  return (
    <div className={ classes.sidebar__container }>
      <div className={ classes.sidebar__wrapper }>
        { props.children }
      </div>
    </div>
  )
}

export default Sidebar
