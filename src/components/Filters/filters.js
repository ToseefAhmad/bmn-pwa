import React, { useMemo } from 'react'
import { array, arrayOf, shape, string } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import FilterBlock from './filter-block'
import defaultClasses from './filters.less'

import FILTER_INTROSPECTION from '../../queries/introspection/filterIntrospectionQuery.graphql'
import { useFilterList } from '../../talons/useFilterList'

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const Filters = props => {
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
    filterItems,
    filterNames,
    filterState,
    handleApply
  } = talonProps

  const classes = mergeClasses(defaultClasses, props.classes)

  const filtersList = useMemo(
    () =>
      Array.from(filterItems, ([ group, items ]) => {
        const blockState = filterState.get(group)
        const groupName = filterNames.get(group)

        return (
          <FilterBlock
            key={ group }
            filterApi={ filterApi }
            filterState={ blockState }
            group={ group }
            onApply={ handleApply }
            items={ items }
            name={ groupName }
          />
        )
      }),
    [ filterApi, filterItems, filterNames, filterState ]
  )

  return (
    <>
      <div className={ classes.body }>
        <ul className={ classes.blocks }>
          { filtersList }
        </ul>
      </div>
    </>
  )
}

Filters.propTypes = {
  classes: shape({
    blocks: string,
    body: string,
    header: string,
    headerTitle: string,
    root: string,
    root_open: string
  }),
  filters: arrayOf(
    shape({
      attribute_code: string,
      items: array
    })
  )
}

export default Filters
