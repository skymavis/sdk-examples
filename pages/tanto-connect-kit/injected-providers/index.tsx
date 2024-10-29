import React, { FC } from "react";

import Layout from "../../../src/tanto-connect-kit/components/layout/Layout";
import InjectedProviders from "../../../src/tanto-connect-kit/components/connectors/injected-providers/InjectedProviders";

const InjectedWalletsPage: FC = () => {
  return (
    <Layout>
      <InjectedProviders />
    </Layout>
  );
};

export default InjectedWalletsPage;
