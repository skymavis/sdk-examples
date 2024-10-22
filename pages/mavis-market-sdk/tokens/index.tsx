import { NextPage } from 'next';
import React from 'react';
import Layout from 'src/mavis-market-sdk/components/layout/Layout';
import Tokens from 'src/mavis-market-sdk/components/tokens/Tokens';

const CollectionsPage: NextPage = () => {
  return (
    <Layout>
      <Tokens />
    </Layout>
  );
};

export default CollectionsPage;
