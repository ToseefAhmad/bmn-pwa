import React from 'react';
import { arrayOf, func, shape, string } from 'prop-types'
import { Form } from 'informed';
import { useFilterBlock } from '../../talons/FilterModel/useFilterBlock';
import setValidator from '@magento/peregrine/lib/validators/set';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import FilterList from './FilterList/filter-list';
import defaultClasses from './filter-block.less';

const FilterBlock = props => {
  const {
    filterApi,
    filterState,
    onApply,
    group,
    items,
    name
  } = props;
  const talonProps = useFilterBlock({
    filterState,
    items
  })
  const {
    handleClick,
    hasSelected,
    isExpanded
  } = talonProps;
  const classes = mergeClasses(defaultClasses, props.classes);
  const iconClass = isExpanded ? classes.arrow_up : classes.arrow_down;
  const listClass = isExpanded
    ? classes.list_expanded
    : classes.list_collapsed;

  return (
    <li className={ classes.root }>
      <button
        className={ classes.trigger }
        onClick={ handleClick }
        type="button"
      >
        <span className={ classes.header }>
            <span className={ classes.name }>
              { name }
            </span>
            <span className={ iconClass }>
            </span>
        </span>
      </button>
      <Form className={ listClass }>
        <FilterList
          filterApi={ filterApi }
          filterState={ filterState }
          handleApply={ onApply }
          group={ group }
          items={ items }
          hasSelected={ hasSelected }
        />
      </Form>
    </li>
  );
};

export default FilterBlock;

FilterBlock.propTypes = {
  classes: shape({
    header: string,
    list_collapsed: string,
    list_expanded: string,
    name: string,
    root: string,
    trigger: string,
    arrow_up: string,
    arrow_down: string
  }),
  filterApi: shape({}).isRequired,
  filterState: setValidator,
  group: string.isRequired,
  onApply: func,
  items: arrayOf(shape({})),
  name: string.isRequired
};
