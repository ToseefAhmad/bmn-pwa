import React, { Fragment, useCallback, useMemo } from 'react'
import { useFilterList } from '../../../talons/useFilterList'

import t from '@bmn/translate'
import FILTER_INTROSPECTION from '../../../queries/introspection/filterIntrospectionQuery.graphql'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './current-filters.less'
import CurrentFilter from './current-filter'
import { any, shape, string } from 'prop-types'

const CurrentFilters = props => {
  const {
    filters,
    pageControl
  } = props
  const talonProps = useFilterList({
    filters,
    pageControl,
    queries: { filterIntrospection: FILTER_INTROSPECTION }
  })

  const {
    filterApi,
    filterNames,
    filterState,
    handleReset,
    handleApply
  } = talonProps

  const { removeItem } = filterApi
  const classes = mergeClasses(defaultClasses, props.classes)

  const handleRemoveItem = useCallback((group, item) => {
    removeItem({
      group,
      item
    })
    handleApply()
  }, [ removeItem, handleReset, handleApply ])

  // create elements and params at the same time for efficiency
  const filterElements = useMemo(() => {
    const elements = []
    for (const [ group, items ] of filterState) {
      for (const item of items) {
        const {
          title,
          value
        } = item || {}
        const key = `${ group }::${ title }_${ value }`
        const groupName = filterNames.get(group)

        elements.push(
          <li
            key={ key }
            className={ classes.item }
            onClick={ () => {
              handleRemoveItem(group, item)
            } }
          >
            <CurrentFilter
              group={ group }
              groupName={ groupName }
              item={ item }
              removeItem={ removeItem }
              handleApply={ handleApply }
            />
          </li>
        )
      }
    }

    return elements
  }, [ classes.item, filterNames, filterState, removeItem, handleApply ])

  return filterElements.length > 0
    ? <Fragment>
      <div className={ classes.header }>
        <span className={ classes.title }>{ t({ s: 'Chosen filters:' }) }</span>
        <ul className={ classes.currentFilters }>
          { filterElements }
        </ul>
        <span
          className={ classes.title + ' ' + classes.cursor }
          onClick={ handleReset }
        >
          { t({ s: 'Remove all filters' }) }
        </span>
      </div>
    </Fragment>
    : <Fragment/>
}

CurrentFilters.propTypes = {
  classes: shape({
    currentFilters: string,
    cursor: string,
    header: string,
    item: string,
    title: string
  }),
  filters: any
}

export default CurrentFilters
