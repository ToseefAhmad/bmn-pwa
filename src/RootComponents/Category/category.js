import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import { useStyle } from '@magento/venia-ui/lib/classify';

import CategoryContent from './categoryContent';
import defaultClasses from './category.less';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import { GET_PAGE_SIZE } from './category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { GET_CATEGORY, GET_FILTER_INPUTS } from './category-info.gql'

const Category = props => {
    const { id } = props;

    const talonProps = useCategory({
        id,
        queries: {
            getPageSize: GET_PAGE_SIZE
        },
        operations: {
            getFilterInputsQuery: GET_FILTER_INPUTS,
            getCategoryQuery: GET_CATEGORY
        }
    });

    const {
        error,
        metaDescription,
        loading,
        categoryData,
        pageControl,
        sortProps,
        pageSize
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    if (!categoryData) {
        if (error && pageControl.currentPage === 1) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }

    return (
      <Fragment>
          <Meta name="description" content={metaDescription} />
          <CategoryContent
            categoryId={id}
            classes={classes}
            data={categoryData}
            isLoading={loading}
            pageControl={pageControl}
            sortProps={sortProps}
            pageSize={pageSize}
          />
      </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    id: number
};

Category.defaultProps = {
    id: 3
};

export default Category;
