import React, { Suspense, Fragment, useEffect, useRef } from 'react'

import { Title, Robots } from '@magento/venia-ui/lib/components/Head'
import Sidebar, { getLayoutWrapperClass, PAGE_2_COLUMNS_LEFT } from '../../../../../../src/components/PageLayout/sidebar'
import { shape, string } from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import Pagination from '../../../../../../src/components/Pagination'
import Gallery from '../../../../../../src/components/Gallery'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator'
import FilterModalOpenButton from '../../../../../../src/components/FilterModalOpenButton/filterModalOpenButton'
import ProductSort from '../../../../../../src/components/ProductSort'
import layoutClasses from '../../../../../../src/components/PageLayout/pageLayout.less'
import defaultClasses from '../../../../../../src/RootComponents/Category/category.less'
import CurrentFilters from '../../../../../../src/components/Filters/CurrentFilters/current-filters'
import { useWindowSize } from '@magento/peregrine'
import t from '@bmn/translate'
import CmsBlock from '../../../../../../src/components/Cms/Block'
import { ProductSearch } from './catalog-search.gql'
import { Canonical, NextUrl, PreviousUrl } from "../../../../../../src/components/Canonical";
import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage'

const FilterModal = React.lazy(() => import('../../../../../../src/components/FilterModal'))
const FilterList = React.lazy(() => import('../../../../../../src/components/Filters'))
const filterText = t({ s: 'Show filters' })
let filterHeader

const CatalogSearch = props => {
  const classes = mergeClasses(defaultClasses, props.classes)
  const filterElement = useRef(null)
  const filterButton = useRef(null)
  const windowSize = useWindowSize()
  const params = (new URL(document.location)).searchParams
  const searchQuery = params.get('query')
  const talonProps = useSearchPage({ operations: { productSearchQuery: ProductSearch } })

  const {
    data,
    error,
    filters,
    loading,
    pageControl,
    sortProps
  } = talonProps

  const filterList = filters && filters.length > 0
    ? <FilterList pageControl={pageControl} filters={ filters }/>
    : null
  const currentFilters = filters && filters.length > 0
    ? <CurrentFilters pageControl={pageControl} filters={ filters }/>
    : null

  const toggleFilter = () => {
    if (filterElement.current.style.display === 'block') {
      filterElement.current.style.display = 'none'
      filterButton.current.innerText = t({ s: 'Show filters' })
    } else {
      filterElement.current.style.display = 'block'
      filterButton.current.innerText = t({ s: 'Hide filters' })
    }
  }

  const filterContent = <Fragment>
    <h2 className={ classes.h2 }>
      { t({ s: 'Refine results' }) }
    </h2>
    <Fragment>
      <button
        className={ classes.filterBtn }
        onClick={ toggleFilter }
        ref={ filterButton }
      >
        { t({ s: 'Show filters' }) }
      </button>
      <div
        ref={ filterElement }
        className={ classes.filterList }
      >
        { filterList }
      </div>
    </Fragment>
  </Fragment>

  useEffect(() => {
    if (filterElement.current && filters && filters.length > 2) {
      filterElement.current.style.display = 'block'
      filterHeader = <h2 className={ classes.h2 }>{ t({ s: 'Refine results' }) }</h2>

      if (windowSize.innerWidth < 1024) {
        filterElement.current.style.display = 'none'
        filterHeader = <button
          className={ classes.filterBtn }
          onClick={ toggleFilter }
          ref={ filterButton }
        >
          { filterText }
        </button>
      }
    }
  }, [windowSize, filterElement])

  const showSidebar = windowSize.innerWidth >= 1024

  if (loading) return fullPageLoadingIndicator

  const content = error || !data || data.products.items.length === 0
    ? <Fragment>
      <section className={ layoutClasses.mainContent__container }>
        <h1 className={ `${ classes.categoryTitle } ${ classes.h2 }` }>
          { t({ s: 'No results found for %1', r: [searchQuery] }) }
        </h1>
        <CmsBlock blockId={ 'no_search_results' }/>
      </section>
    </Fragment>
    : <Fragment>
      <section className={ layoutClasses.mainContent__container }>
        <h1 className={ `${ classes.categoryTitle } ${ classes.h2 }` }>
          { t({ s: 'Search results for: %1', r: [searchQuery] }) }
        </h1>
        { currentFilters }
        <div className={ classes.actions }>
            <FilterModalOpenButton filters={ filters }/>
            <ProductSort sortProps={ sortProps }/>
        </div>
        <Gallery
          items={ data.products.items }
          crhData={ data.products.crh_data }
          hasBorder={ true }
        />
        <div className={ classes.pagination }>
          <Pagination pageControl={ pageControl }/>
        </div>
        <Suspense fallback={ null }><FilterModal filters={ filters }/></Suspense>
      </section>
    </Fragment>

  return <Fragment>
    <Robots/>
    <PreviousUrl
      pageControl={ pageControl }
    />
    <NextUrl
      pageControl={ pageControl }
    />
    <Canonical
      href={ window.location.href }
    />
    <Title>{ t({ s: 'Search results for: %1', r: [searchQuery] }) }</Title>
    <article className={ `${ classes.root } ${ getLayoutWrapperClass(PAGE_2_COLUMNS_LEFT) }` }>
      {showSidebar ? <Sidebar
        pageLayout={ PAGE_2_COLUMNS_LEFT }
        children={ filterContent }
      /> : null}
      { content }
    </article>
  </Fragment>
}


CatalogSearch.propTypes = {
  classes: shape({
    noResult: string,
    filterBtn: string,
    filterContainer: string,
    gallery: string,
    h2: string,
    headerButtons: string,
    pagination: string,
    root: string,
    sortContainer: string,
    sorting: string,
    title: string
  })
}

export default CatalogSearch
