import React, { FC } from 'react';

import InjectedProviders from '../../../src/tanto-connect-kit/components/connectors/injected-providers/InjectedProviders';
import Layout from '../../../src/tanto-connect-kit/components/layout/Layout';

const InjectedWalletsPage: FC = () => {
  return (
    <Layout>
      <InjectedProviders />
    </Layout>
  );
};

export default InjectedWalletsPage;
