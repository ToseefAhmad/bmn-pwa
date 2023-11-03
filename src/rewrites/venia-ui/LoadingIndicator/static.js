import React from 'react';

import LoadingIndicator from './indicator';
import t from '@bmn/translate'

// @magento_update translation of loading
const staticIndicator = (
    <LoadingIndicator global={true}>{t({ s: 'Loading...' })}</LoadingIndicator>
);

export default staticIndicator;
