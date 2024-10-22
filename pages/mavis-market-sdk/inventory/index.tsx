import { NextPage } from 'next';
import React from 'react';
import Inventory from 'src/mavis-market-sdk/components/inventory/Inventory';
import Layout from 'src/mavis-market-sdk/components/layout/Layout';

const InventoryPage: NextPage = () => {
  return (
    <Layout>
      <Inventory />
    </Layout>
  );
};

export default InventoryPage;
