import { NextPage } from 'next';
import React from 'react';
import Collections from 'src/mavis-market-sdk/components/all-collections/AllCollections';
import Layout from 'src/mavis-market-sdk/components/layout/Layout';

const CollectionsPage: NextPage = () => {
  return (
    <Layout>
      <Collections />
    </Layout>
  );
};

export default CollectionsPage;
