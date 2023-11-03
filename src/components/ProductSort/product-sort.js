import React, { useMemo, useCallback } from 'react';
import { array, arrayOf, shape, string, oneOf } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import t from '@bmn/translate';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import SortItem from '@magento/venia-ui/lib/components/ProductSort/sortItem';
import defaultClasses from './product-sort.less';

const ProductSort = props => {
  const classes = mergeClasses(defaultClasses)
  const { availableSortMethods, sortProps } = props
  const [currentSort, setSort] = sortProps
  const { elementRef, expanded, setExpanded } = useDropdown()

  let buttonText = t({ s: 'Sort' })

  // click event for menu items
  const handleItemClick = useCallback(
    sortAttribute => {
      setSort({
        sortText: sortAttribute.text,
        sortAttribute: sortAttribute.attribute,
        sortDirection: sortAttribute.sortDirection
      })
      setExpanded(false)
    },
    [setExpanded, setSort]
  )

  const getCurrentSortName = () => {
    for (let i = 0; i < availableSortMethods.length; i++) {
      if (
        availableSortMethods[i].attribute === currentSort.sortAttribute
        && availableSortMethods[i].sortDirection === currentSort.sortDirection
      ) {
        buttonText = availableSortMethods[i].text
        break
      }
    }

    return buttonText
  }

  const sortElements = useMemo(() => {
    // should be not render item in collapsed mode.
    if (!expanded) {
      return null
    }

    const itemElements = Array.from(availableSortMethods, sortItem => {
      const { attribute, sortDirection } = sortItem
      const isActive =
        currentSort.sortAttribute === attribute &&
        currentSort.sortDirection === sortDirection

      const key = `${ attribute }--${ sortDirection }`
      return (
        <li key={ key } className={ classes.menuItem }>
          <SortItem
            sortItem={ sortItem }
            active={ isActive }
            onClick={ handleItemClick }
          />
        </li>
      )
    })

    return (
      <div className={ classes.menu }>
        <ul>{ itemElements }</ul>
      </div>
    )
  }, [
    availableSortMethods,
    classes.menu,
    classes.menuItem,
    currentSort.sortAttribute,
    currentSort.sortDirection,
    expanded,
    handleItemClick
  ])

  // expand or collapse on click
  const handleSortClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div ref={ elementRef } className={ classes.root }>
      <button onClick={ handleSortClick } className={ classes.sortButton }>
        { getCurrentSortName() }
      </button>
      { sortElements }
    </div>
  )
}

const sortDirections = oneOf(['ASC', 'DESC'])

ProductSort.propTypes = {
  availableSortMethods: arrayOf(
    shape({
      text: string,
      attribute: string,
      sortDirection: sortDirections
    })
  ),
  sortProps: array
}

ProductSort.defaultProps = {
  availableSortMethods: [
    {
      id: 'sortItem.popularity.desc',
      text: t({ s: 'Popularity (↓)' }),
      attribute: 'populariteit',
      sortDirection: 'DESC'
    },
    {
      id: 'sortItem.popularity.asc',
      text: t({ s: 'Popularity (↑)' }),
      attribute: 'populariteit',
      sortDirection: 'ASC'
    },
    {
      id: 'sortItem.name.asc',
      text: t({ s: 'Name (A-Z)' }),
      attribute: 'name',
      sortDirection: 'ASC'
    },
    {
      id: 'sortItem.name.desc',
      text: t({ s: 'Name (Z-A)' }),
      attribute: 'name',
      sortDirection: 'DESC'
    },
    {
      id: 'sortItem.position.asc',
      text: t({ s: 'Position (↑)' }),
      attribute: 'position',
      sortDirection: 'ASC'
    },
    {
      id: 'sortItem.position.desc',
      text: t({ s: 'Position (↓)' }),
      attribute: 'position',
      sortDirection: 'DESC'
    }
  ]
}

export default ProductSort
