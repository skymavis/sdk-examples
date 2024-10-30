import React, { FC } from 'react';

import RoninWallet from '../../../src/tanto-connect-kit/components/connectors/ronin-wallet/RoninWallet';
import Layout from '../../../src/tanto-connect-kit/components/layout/Layout';

const RoninWalletPage: FC = () => {
  return (
    <Layout>
      <RoninWallet />
    </Layout>
  );
};

export default RoninWalletPage;
