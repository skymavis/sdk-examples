import { FC } from 'react';

import RoninWalletConnect from '../../../src/tanto-connect-kit/components/connectors/ronin-wallet-connect/RoninWalletConnect';
import Layout from '../../../src/tanto-connect-kit/components/layout/Layout';

const RoninWCPage: FC = () => {
  return (
    <Layout>
      <RoninWalletConnect />
    </Layout>
  );
};

export default RoninWCPage;
