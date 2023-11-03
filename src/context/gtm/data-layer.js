import React, { createContext, useContext } from 'react'
import { node, object } from 'prop-types';
import { merge } from 'lodash-es';
import { dataLayerConfig } from './data';

export const DataLayer = createContext(null);

const defaultDataLayer = dataLayerConfig;

export const DataLayerProvider = ({ children, additionalDataLayer = {} }) => {
  return (
    <DataLayer.Provider
      value={merge({}, defaultDataLayer, additionalDataLayer)}
    >
      {children}
    </DataLayer.Provider>
  )
}

export const useDataLayerConfig = () => useContext(DataLayer);

DataLayerProvider.propTypes = {
  children: node.isRequired,
  query: object,
  additionalDataLayer: object,
}
