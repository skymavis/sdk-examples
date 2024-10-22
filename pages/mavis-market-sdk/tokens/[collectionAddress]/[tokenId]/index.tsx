import { NextPage } from 'next';
import React from 'react';
import Layout from 'src/mavis-market-sdk/components/layout/Layout';
import TokenDetail from 'src/mavis-market-sdk/components/tokens/token-detail/TokenDetail';

const TokenDetailPage: NextPage = () => {
  return (
    <Layout>
      <TokenDetail />
    </Layout>
  );
};

export default TokenDetailPage;
