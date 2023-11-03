import React, { useMemo, useCallback } from 'react'
import { number, shape, string } from 'prop-types'
import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination'
import { useHistory } from 'react-router-dom'

import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './pagination.less'
import Tile from './Tile/tile'
import NavButton from './NavButton/nav-button'
import t from '@bmn/translate'

const Pagination = props => {
  const {
    currentPage,
    totalPages
  } = props.pageControl

  const {
    isActiveLeft,
    isActiveRight,
    tiles
  } = usePagination({
    currentPage,
    totalPages
  })

  const { location } = useHistory();
  const { search } = location;

  const getPaginationLink = useCallback((payload) => {
    const urlParams = new URLSearchParams(search);
    const page = urlParams.get('page');

    if (typeof payload === 'number') urlParams.set('page', payload)
    if (typeof payload === 'string') {
      if (payload === 'prev') urlParams.set('page', +page - 1)
      else if (payload === 'next') urlParams.set('page', +page + 1);
    }

    return '?' + urlParams.toString();
  }, [search]);

  const navigationTiles = useMemo(() => {
    return tiles.map(tileNumber => {
        return  <Tile
        isActive={ tileNumber === currentPage }
        key={ tileNumber }
        number={ tileNumber }
        link={getPaginationLink(tileNumber)}
        />
    })
  }, [currentPage, getPaginationLink, tiles])

  if (totalPages === 1) {
    return null
  }

  const classes = mergeClasses(defaultClasses, props.classes)

  return (
    <div className={ classes.paginationWrapper }>
      <NavButton
        className={ 'prev' }
        active={ isActiveLeft }
        link={ getPaginationLink('prev') }
        label={ t({ s: 'Previous' }) }
      />
      { navigationTiles }
      <NavButton
        className={ 'next' }
        active={ isActiveRight }
        link={ getPaginationLink('next') }
        label={ t({ s: 'Next' }) }
      />
    </div>
  )
}

Pagination.propTypes = {
  classes: shape({
    paginationWrapper: string
  }),
  pageControl: shape({
    currentPage: number,
    totalPages: number
  }).isRequired
}

export default Pagination
