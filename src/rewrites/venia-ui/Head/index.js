import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async';

import { gql, useQuery } from '@apollo/client'
import GET_DESIGN_CONFIG from "../../../queries/getDesignConfig.graphql";

export { default as HeadProvider } from '@magento/venia-ui/lib/components/Head/headProvider';

Helmet.defaultProps.defer = false;

export const Link = props => {
  const { children, ...tagProps } = props;
  return (
    <Helmet>
      <link { ...tagProps }>{ children }</link>
    </Helmet>
  );
};

export const Meta = props => {
  const { children, ...tagProps } = props;
  return (
    <Helmet>
      <meta { ...tagProps }>{ children }</meta>
    </Helmet>
  );
};

export const Style = props => {
  const { children, ...tagProps } = props;
  return (
    <Helmet>
      <style { ...tagProps }>{ children }</style>
    </Helmet>
  );
};

export const Robots = () => {
  const {
    data,
    loading,
    error
  } = useQuery(GET_DESIGN_CONFIG)

  let robots = <></>

  if (loading || error) {
    return robots
  }

  const { storeConfig } = data || {}
  const { design_search_engine_robots_default_robots } = storeConfig || ''

  if (design_search_engine_robots_default_robots) {
    robots = <Meta
      name={ 'robots' }
      content={ design_search_engine_robots_default_robots }
    />
  }

  return robots;
}

export const Title = props => {
  const { children, ...tagProps } = props;
  const {
    data,
    loading,
    error
  } = useQuery(GET_DESIGN_CONFIG)

  let title = children

  if (loading || error) {
    return title
  }

  const { storeConfig } = data || {}
  const { design_head_title_suffix } = storeConfig || ''

  if (design_head_title_suffix) {
    title = children + ' ' + design_head_title_suffix
  }

  return (
    <Helmet>
      <title { ...tagProps }>{ title }</title>
    </Helmet>
  )
}

const STORE_NAME_QUERY = gql`
    query getStoreName {
        storeConfig {
            id
            store_name
        }
    }
`;

export const StoreTitle = props => {
  const { children, ...tagProps } = props;

  const { data: storeNameData } = useQuery(STORE_NAME_QUERY);

  const storeName = useMemo(() => {
    return storeNameData
      ? storeNameData.storeConfig.store_name
      : STORE_NAME;
  }, [storeNameData]);

  let titleText;
  if (children) {
    titleText = `${children} - ${storeName}`;
  } else {
    titleText = storeName;
  }

  return (
    <Helmet>
      <title {...tagProps}>{titleText}</title>
    </Helmet>
  );
};
