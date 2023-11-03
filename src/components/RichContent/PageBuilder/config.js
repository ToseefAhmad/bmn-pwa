import React from 'react';

import CustomProjectConfigAggregator from './ContentTypes/CustomProject/configAggregator'
import CustomCategoryConfigAggregator from './ContentTypes/CustomCategory/configAggregator'
import CustomFaqConfigAggregator from './ContentTypes/CustomFaq/configAggregator'
import ExceptionalHeaderConfigAggregator from './ContentTypes/ExceptionalHeader/configAggregator'
import FormBuilderConfigAggregator from './ContentTypes/FormBuilder/configAggregator'
import ExceptionalHeader from './ContentTypes/ExceptionalHeader'

const customPageBuilderConfig = {
  bmn_category: {
    configAggregator: CustomCategoryConfigAggregator,
    component: React.lazy(() => import('./ContentTypes/CustomCategory'))
  },
  bmn_faq: {
    configAggregator: CustomFaqConfigAggregator,
    component: React.lazy(() => import('./ContentTypes/CustomFaq'))
  },
  bmn_exceptional_header: {
    configAggregator: ExceptionalHeaderConfigAggregator,
    component: ExceptionalHeader
  },
  bmn_projects: {
    configAggregator: CustomProjectConfigAggregator,
    component: React.lazy(() => import('./ContentTypes/CustomProject/custom-project'))
  },
  bmn_formbuilderpwa: {
    configAggregator: FormBuilderConfigAggregator,
    component: React.lazy(() => import('./ContentTypes/FormBuilder/form-builder'))
  }
}

export default customPageBuilderConfig;
