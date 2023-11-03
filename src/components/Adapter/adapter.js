import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { DataLayerProvider } from '../../context/gtm'

import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '../App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';

const Adapter = props => {
    const talonProps = useAdapter(props);
    const {
        apolloProps,
        initialized,
        reduxProps,
        routerProps,
        urlHasStoreCode
    } = talonProps;

    if (!initialized) {
        return null;
    }

    const children = props.children || <App />;
    const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

    return (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <BrowserRouter {...routerProps}>
                    {storeCodeRouteHandler}
                    <DataLayerProvider>
                        <AppContextProvider>{children}</AppContextProvider>
                    </DataLayerProvider>
                </BrowserRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

export default Adapter;
