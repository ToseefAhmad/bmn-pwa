import React, { useMemo } from 'react';
import { FocusScope } from 'react-aria';
import { array, arrayOf, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

import t from '@bmn/translate'
import { useStyle } from '@magento/venia-ui/lib/classify'
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import CurrentFilters from '@magento/venia-ui/lib/components/FilterModal/CurrentFilters';
import FilterBlock from '@magento/venia-ui/lib/components/FilterModal/filterBlock';
import FilterFooter from './filterFooter';
import defaultClasses from '@magento/venia-ui/lib/components/FilterModal/filterModal.module.css';
import Button, { BUTTON_TYPE_BUTTON } from '../Button';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const talonProps = useFilterModal({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        handleReset,
        handleKeyDownActions,
        isOpen
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const modalClass = isOpen ? classes.root_open : classes.root;

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items]) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);

                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        group={group}
                        items={items}
                        name={groupName}
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState]
    );

    const filtersAriaLabel = t({ s: 'Filters' })
    const closeAriaLabel = t({ s: 'Close filters popup.' })
    const clearAllAriaLabel = t({ s: 'Remove all filters' })

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <Button
                cssClass="link"
                type={BUTTON_TYPE_BUTTON}
                onClick={handleReset}
                text={t({ s: 'Remove all filters' })}
            />
        </div>
    ) : null;

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain restoreFocus autoFocus>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <aside className={modalClass} onKeyDown={handleKeyDownActions}>
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                {t({ s: 'Filters' })}
                            </h2>
                            <button
                                onClick={handleClose}
                                aria-disabled={false}
                                aria-label={closeAriaLabel}
                            >
                                <Icon src={CloseIcon} />
                            </button>
                        </div>
                        <CurrentFilters
                            filterApi={filterApi}
                            filterNames={filterNames}
                            filterState={filterState}
                        />
                        {clearAll}
                        <ul
                            className={classes.blocks}
                            aria-label={filtersAriaLabel}
                        >
                            {filtersList}
                        </ul>
                    </div>
                    <FilterFooter
                        applyFilters={handleApply}
                        hasFilters={!!filterState.size}
                        isOpen={isOpen}
                    />
                </aside>
            </FocusScope>
        </Portal>
    );
};

FilterModal.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    )
};

export default FilterModal;
