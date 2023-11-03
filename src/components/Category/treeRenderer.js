import React, { Fragment, useCallback, useState } from 'react'
import { arrayOf, number, shape, string } from 'prop-types'
import { Link } from 'react-router-dom'
import classes from './tree.less'
import arrowIcon from '../../web/icons/arrow-down-primary.svg'
import t from '@bmn/translate'
import { useHistory } from 'react-router-dom'

const TreeRenderer = props => {
  const {
    name,
    url,
    productCount,
    level,
    children = []
  } = props

  const history = useHistory()
  const [isVisible, setIsVisible] = useState(false)

  const onClick = e => {
    if (children.length > 0 && level === 1 && window.matchMedia('(max-width: 1023px)').matches) {
      e.preventDefault()
      setIsVisible(!isVisible)
    }
  }

  const goToUrl = useCallback(e => {
    const hasChildren = e.target.getAttribute('data-node-has-children')

    if (hasChildren === 'false') {
      history.push(url)
    }
  }, [url, history])

  const CategoryName = () =>
    level === 1
      ? name
      : name + ' (' + productCount + ')'

  return (
    <div
      className={ isVisible ? classes.treeWrapper + ' ' + classes['treeWrapper--open'] : classes.treeWrapper}
      data-hierarchy-level={ level }
      data-node-has-children={ children.length > 0 }
    >
      <div
        className={ classes.treeUrl }
        onClick={ onClick }
      >
        <Link to={ url }>
          <CategoryName />
        </Link>
        <img
          src={ arrowIcon }
          title={ t({ s: 'Go to %1', r: [ name ] }) }
          width={ '20px' }
          alt={ name }
          className={ classes.arrowIcon }
          onClick={ goToUrl }
          data-node-has-children={ children.length > 0 }
        />
      </div>
      {
        children.map((category, key) => {
          return <Fragment key={ key }>
            <TreeRenderer
              name={ category.name }
              url={ category.url }
              productCount={ category.product_count }
              level={ level + 1 }
              children={ category.children }
            />
          </Fragment>
        })
      }
    </div>
  )
}

TreeRenderer.propTypes = {
  name: string.isRequired,
  url: string.isRequired,
  productCount: number.isRequired,
  level: number.isRequired,
  children: arrayOf(shape({
    name: string,
    product_count: number,
    url: string,
  }))
}

export default TreeRenderer
