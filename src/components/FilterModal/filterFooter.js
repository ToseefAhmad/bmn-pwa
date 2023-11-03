import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useFilterFooter } from '@magento/peregrine/lib/talons/FilterModal';

import t from '@bmn/translate'
import { useStyle } from '@magento/venia-ui/lib/classify'
import Button, { BUTTON_TYPE_BUTTON } from '../Button';
import defaultClasses from '@magento/venia-ui/lib/components/FilterModal/filterFooter.module.css';

const FilterFooter = props => {
    const { applyFilters, hasFilters, isOpen } = props;
    const { touched } = useFilterFooter({
        hasFilters,
        isOpen
    });

    const classes = useStyle(defaultClasses, props.classes);
    const buttonLabel = t({ s: 'Apply' })

    return (
        <div className={classes.root}>
            <Button
                cssClass="primary"
                type={BUTTON_TYPE_BUTTON}
                // disabled={!touched}
                onClick={applyFilters}
            >
                {buttonLabel}
            </Button>
        </div>
    );
};

FilterFooter.propTypes = {
    applyFilters: func.isRequired,
    classes: shape({
        root: string
    }),
    hasFilters: bool,
    isOpen: bool
};

export default FilterFooter;
