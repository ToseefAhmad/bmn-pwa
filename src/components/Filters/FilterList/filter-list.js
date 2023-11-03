import React, { Fragment, useMemo, useRef } from 'react'
import { array, func, shape, string } from 'prop-types'
import { useFieldState } from 'informed';
import setValidator from '@magento/peregrine/lib/validators/set';

import t from '@bmn/translate'
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import FilterItem from './filter-item';
import defaultClasses from './filter-list.less';

const labels = new WeakMap();

const FilterList = props => {
  const {
    filterApi,
    filterState,
    handleApply,
    group,
    items,
    hasSelected
  } = props;
  const filterListElement = useRef(null)
  const classes = mergeClasses(defaultClasses, props.classes);

  const { value: searchValue } = useFieldState('filter_search');
  const normalizedSearch = (searchValue || '').toUpperCase();

  const handleClick = () => {
    filterListElement.current.classList.toggle( classes.open )
  }

  // memoize item creation
  // search value is not referenced, so this array is stable
  const itemElements = useMemo(
    () => {
      return items.map(item => {
        const { title, value } = item
        const key = `item-${group}-${value}`

        const element = (
          <li
            key={ key }
            className={ classes.item }
          >
            <FilterItem
              filterApi={ filterApi }
              filterState={ filterState }
              handleApply={ handleApply }
              group={ group }
              item={ item }
            />
          </li>
        );

        labels.set(element, title.toUpperCase() || '');

        return element
      })
    }, [classes, filterApi, filterState, group, items]
  )

  // filter item elements after creating them
  // this runs after each keystroke, but it's quick
  const filteredItemElements = normalizedSearch
    ? itemElements.filter(element =>
      labels.get(element).includes(normalizedSearch)
    )
    : itemElements;

  return (
    <Fragment>
      {
        filteredItemElements.length > 5
          ? <Fragment>
            <div className={ classes.filterWrapper }>
              <ul
                className={ hasSelected ? `${classes.items} ${classes.open}` : classes.items }
                ref={ filterListElement }
              >
              { filteredItemElements }
              </ul>
              <div
                className={ classes.triggerOpen }
                onClick={ handleClick }
              >
                { t({ s: 'Show more'}) }
              </div>
              <div
                className={ classes.triggerClose }
                onClick={ handleClick }
              >
                { t({ s: 'Show less'}) }
              </div>
            </div>
          </Fragment>
          : <ul className={ classes.items }>
            { filteredItemElements }
          </ul>
      }
    </Fragment>
  );
};

FilterList.propTypes = {
  classes: shape({
    filterWrapper: string,
    item: string,
    items: string,
    open: string,
    triggerOpen: string,
    triggerClose: string
  }),
  filterApi: shape({}),
  filterState: setValidator,
  handleApply: func,
  group: string,
  items: array
};

export default FilterList;
