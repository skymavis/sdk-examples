import React, { FC } from 'react';

import Layout from '../../src/tanto-connect-kit/components/layout/Layout';
import RoninWalletPage from './ronin-wallet';

const TantoConnectKitPage: FC = () => {
  return (
    <Layout>
      <RoninWalletPage />
    </Layout>
  );
};

export default TantoConnectKitPage;
