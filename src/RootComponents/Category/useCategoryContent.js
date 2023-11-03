import { useCallback, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useAppContext } from '@magento/peregrine/lib/context/app'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge'
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/RootComponents/Category/categoryContent.gql'

const DRAWER_NAME = 'filter'

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {number} result.categoryId - This category's ID.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {func}   result.handleLoadFilters - A callback function to signal the user's intent to interact with the filters.
 * @returns {func}   result.handleOpenFilters - A callback function that actually opens the filter drawer.
 * @returns {object} result.items - The items in this category.
 * @returns {bool}   result.loadFilters - Whether or not the user has signalled their intent to interact with the filters.
 * @returns {string} result.pageTitle - The text to put in the browser tab for this page.
 */
export const useCategoryContent = props => {
  const {
    categoryId,
    data,
    pageSize = 6
  } = props;

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getProductFiltersByCategoryQuery } = operations;

  const placeholderItems = Array.from({ length: pageSize }).fill(null);
  const [loadFilters, setLoadFilters] = useState(false);
  const [, { toggleDrawer }] = useAppContext();

  const handleLoadFilters = useCallback(() => {
    setLoadFilters(true);
  }, [setLoadFilters]);
  const handleOpenFilters = useCallback(() => {
    setLoadFilters(true);
    toggleDrawer(DRAWER_NAME);
  }, [setLoadFilters, toggleDrawer]);

  const [getFilters, { data: filterData }] = useLazyQuery(
    getProductFiltersByCategoryQuery,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first'
    }
  );

  useEffect(() => {
    if (categoryId) {
      getFilters({
        variables: {
          categoryIdFilter: {
            eq: categoryId
          }
        }
      });
    }
  }, [categoryId, getFilters]);

  const filters = filterData ? filterData.products.aggregations : null
  const items = data ? data.products.items : placeholderItems
  const totalPagesFromData = data
    ? data.products.page_info.total_pages
    : null

  const categoryName = data ? data.category.name : null
  // Note: STORE_NAME is injected by Webpack at build time.
  const pageTitle = categoryName
    ? `${ categoryName } - ${ STORE_NAME }`
    : STORE_NAME

  const categoryDescription = data ? data.category.description : null
  const pageLayout = data ? data.category.page_layout : null
  const displayMode = data ? data.category.display_mode : null
  const childCategories = data ? data.category.child_categories : null

  return {
    categoryName,
    categoryDescription,
    filters,
    handleLoadFilters,
    handleOpenFilters,
    items,
    loadFilters,
    pageTitle,
    pageLayout,
    displayMode,
    childCategories,
    totalPagesFromData
  }
}
