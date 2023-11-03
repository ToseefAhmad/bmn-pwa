import React, { Fragment } from 'react'
import { arrayOf, number, shape, string } from 'prop-types'
import classes from './tree.less'
import TreeRenderer from './treeRenderer'

const Tree = props => {
  const {
    childCategories,
    level = 1,
  } = props

  return (
    <div className={ classes.treeContainer }>
      {
        childCategories.map((category, key) => {
          return <Fragment key={ key }>
            <TreeRenderer
              name={ category.name }
              url={ category.url }
              productCount={ category.product_count }
              level={ level }
              children={ category.children }
            />
          </Fragment>
        })
      }
    </div>
  )
}

Tree.propTypes = {
  childCategories: arrayOf(
    shape({
      name: string,
      product_count: number,
      url: string,
    }),
  ),
  level: number,
}

export default Tree
