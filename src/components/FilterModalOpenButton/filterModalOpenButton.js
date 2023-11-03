import React from 'react';
import { shape, string, array } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify'
import defaultClasses from './filterModalOpenButton.less';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

const FilterModalOpenButton = props => {
    const { filters, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const { handleOpen } = useFilterModal({ filters });

    return (
        <button
            className={classes.filterButton}
            onClick={handleOpen}
            type="button"
            aria-live="polite"
            aria-busy="false"
        >
            <FormattedMessage
                id={'productList.filter'}
                defaultMessage={'Filter'}
            />
        </button>
    );
};

export default FilterModalOpenButton;

FilterModalOpenButton.propTypes = {
    classes: shape({
        filterButton: string
    }),
    filters: array
};
