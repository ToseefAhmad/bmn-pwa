import React, { Fragment } from 'react';
import { arrayOf, shape, objectOf, string, mixed } from 'prop-types'

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './table.less';

const Table = props => {
  const { data } = props
  const classes = mergeClasses(defaultClasses, props.classes);
  let tableContent;

  if (data) {
    tableContent = data.map((item, key) => {
      return (
        <Fragment key={ key }>
          <dt>{ item.key }</dt>
          <dd>{ item.value }</dd>
        </Fragment>
      )
    })
  }

  return tableContent ?
    <dl className={ classes.table }>
      { tableContent }
    </dl>
    : <></>
}

Table.propTypes = {
  classes: shape({
    table: string
  }),
  data: arrayOf(
    shape({
      key: string.isRequired,
      value: mixed
    }),
  ),
}

export default Table
