import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextPage } from 'next';
import React from 'react';
import Layout from 'src/katana-swap-sdk/components/layout/Layout';
import SwapForm from 'src/katana-swap-sdk/components/swap-form/SwapForm';
import GlobalDataStoreUpdater from 'src/katana-swap-sdk/components/updaters/GlobalDataStoreUpdater';
import { SwapContextProvider } from 'src/katana-swap-sdk/context/SwapContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const KatanaSwapSDKPage: NextPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SwapContextProvider>
        <Layout>
          <GlobalDataStoreUpdater />
          <SwapForm />
        </Layout>
      </SwapContextProvider>
    </QueryClientProvider>
  );
};

export default KatanaSwapSDKPage;
