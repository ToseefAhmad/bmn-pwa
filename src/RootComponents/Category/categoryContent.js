import React, { Fragment, Suspense, useMemo, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { array, number, shape, string } from 'prop-types'

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport'
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category'

import { useStyle } from '@magento/venia-ui/lib/classify'
import Breadcrumbs from '../../components/Breadcrumbs'
import {
  FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton'
import FilterModalOpenButton from '../../components/FilterModalOpenButton/filterModalOpenButton'
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar'
import Gallery from '../../components/Gallery'
import { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery'
import { Title } from '@magento/venia-ui/lib/components/Head'
import Pagination from '../../components/Pagination'
import RichContent from '@magento/venia-ui/lib/components/RichContent'
import Shimmer from '@magento/venia-ui/lib/components/Shimmer'
import SortedByContainer, { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer'
import defaultClasses from './category.less'
import NoProductsFound from './NoProductsFound'
import { isNativeApp } from '../../utils/recogniseNativeApp'
import t from '@bmn/translate'
import CurrentFilters from '../../components/Filters/CurrentFilters/current-filters'
import FilterList from '../../components/Filters/FilterList/filter-list'
import ReadMore from '../../components/ReadMore'
import ProductSort from '../../components/ProductSort'
import { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort'

const FilterModal = React.lazy(() => import('../../components/FilterModal'))
const FilterSidebar = React.lazy(() =>
  import('../../components/FilterSidebar')
)

const CategoryContent = props => {
  const {
    categoryId,
    data,
    isLoading,
    pageControl,
    sortProps,
    pageSize
  } = props

  const [currentSort] = sortProps
  const {
    category: categoryData,
    products: productsData
  } = data || {}
  const {
    page_layout: pageLayout
  } = categoryData || {}
  const {
    crh_data: crhData
  } = productsData || {}
  const filterElement = useRef(null)
  const filterButton = useRef(null)

  const talonProps = useCategoryContent({
    categoryId,
    data,
    pageSize
  })

  const {
    categoryName,
    categoryDescription,
    filters,
    items,
    totalCount,
    totalPagesFromData
  } = talonProps

  const sidebarRef = useRef(null)
  const classes = useStyle(defaultClasses, props.classes)
  const shouldRenderSidebarContent = useIsInViewport({
    elementRef: sidebarRef
  })

  const shouldShowFilterButtons = filters && filters.length && !isLoading
  const shouldShowFilterShimmer = filters === null || isLoading

  // If there are no products we can hide the sort button.
  const shouldShowSortButtons = totalPagesFromData && !isLoading
  const shouldShowSortShimmer = !totalPagesFromData && isLoading

  const maybeFilterButtons = shouldShowFilterButtons ? (
    <FilterModalOpenButton filters={ filters }/>
  ) : shouldShowFilterShimmer ? (
    <FilterModalOpenButtonShimmer/>
  ) : null

  const filtersModal = shouldShowFilterButtons ? (
    <FilterModal filters={ filters }/>
  ) : null

  const filterList = filters && filters.length > 0
    ? <FilterList filters={ filters }/>
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

  const sidebar = shouldShowFilterButtons ? (
    <FilterSidebar filters={ filters }/>
  ) : shouldShowFilterShimmer ? (
    <FilterSidebarShimmer/>
  ) : null

  const maybeSortButton = shouldShowSortButtons ? (
    <ProductSort sortProps={ sortProps }/>
  ) : shouldShowSortShimmer ? (
    <ProductSortShimmer/>
  ) : null

  const maybeSortContainer = shouldShowSortButtons ? (
    <SortedByContainer currentSort={ currentSort }/>
  ) : shouldShowSortShimmer ? (
    <SortedByContainerShimmer/>
  ) : null

  const isAppEnabled = isNativeApp()

  const categoryResultsHeading =
    totalCount > 0 ? (
      <FormattedMessage
        id={ 'categoryContent.resultCount' }
        values={ {
          count: totalCount
        } }
        defaultMessage={ '{count} Results' }
      />
    ) : isLoading ? (
      <Shimmer width={ 5 }/>
    ) : null

  const content = useMemo(() => {
    if (!totalPagesFromData && !isLoading) {
      return <NoProductsFound categoryId={ categoryId }/>
    }

    const gallery = totalPagesFromData ? (
      <Gallery
        items={ items }
        crhData={ crhData }
      />
    ) : (
      <GalleryShimmer items={ items }/>
    )

    const pagination = totalPagesFromData ? (
      <Pagination pageControl={ pageControl }/>
    ) : null

    return (
      <Fragment>
        <section className={ classes.gallery }>{ gallery }</section>
        <div className={ classes.pagination }>{ pagination }</div>
      </Fragment>
    )
  }, [
    categoryId,
    classes.gallery,
    classes.pagination,
    isLoading,
    items,
    pageControl,
    totalPagesFromData
  ])

  const categoryTitle = categoryName ? categoryName : <Shimmer width={ 5 }/>
  return (
    <Fragment>
      {
        !isAppEnabled
          ? <Breadcrumbs categoryId={ categoryId }/>
          : <Fragment/>
      }
      <Title>{ categoryTitle }</Title>
      <article className={ `${ classes.root } page-${ pageLayout }` }>
        {
          pageLayout !== '1column'
            ? <div ref={ sidebarRef } className={ classes.sidebar }>
                <Suspense fallback={ <FilterSidebarShimmer/> }>
                  { shouldRenderSidebarContent ? sidebar : null }
                </Suspense>
              </div>
            : { maybeSortContainer }
        }
        <div className={ classes.contentWrapper }>
          <div className={ classes.heading }>
            <h1 className={ `${ classes.categoryTitle } ${ classes.h2 }` }>
              { categoryTitle }
            </h1>
            <ReadMore
              mobileOnly={ true }
              readMoreAsGradient={ true }
            >
              <RichContent html={ categoryDescription }/>
            </ReadMore>
            { currentFilters }

            <div className={ classes.actions }>
              { maybeFilterButtons }
              { maybeSortButton }
            </div>
            { content }
          </div>
          <Suspense fallback={ null }>{ filtersModal }</Suspense>
        </div>
      </article>
    </Fragment>
  )
}

export default CategoryContent

CategoryContent.propTypes = {
  classes: shape({
    gallery: string,
    pagination: string,
    root: string,
    categoryHeader: string,
    title: string,
    categoryTitle: string,
    sidebar: string,
    categoryContent: string,
    heading: string,
    categoryInfo: string,
    headerButtons: string
  }),
  // sortProps contains the following structure:
  // [{sortDirection: string, sortAttribute: string, sortText: string},
  // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
  sortProps: array,
  pageSize: number
}
